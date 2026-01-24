package main

import (
	"bytes" 
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/wechatpay-apiv3/wechatpay-go/core"
	"github.com/wechatpay-apiv3/wechatpay-go/core/notify"
	"github.com/wechatpay-apiv3/wechatpay-go/core/option"
	"github.com/wechatpay-apiv3/wechatpay-go/core/downloader"
	"github.com/wechatpay-apiv3/wechatpay-go/core/auth/verifiers"
	"github.com/wechatpay-apiv3/wechatpay-go/services/payments/jsapi"
	"github.com/wechatpay-apiv3/wechatpay-go/utils"
	"github.com/wechatpay-apiv3/wechatpay-go/services/refunddomestic"
)

func main() {
	var (
		mchID                      string = "1738346388"                                // Merchant ID
		mchCertificateSerialNumber string = "5D1A93B2210662938B478568045CD3612D1378AF"  // Merchant certificate serial number
		mchAPIv3Key                string = "12345678123456781234567812345678"          // Merchant APIv3 key
	)

	// Load merchant private key from local file
	mchPrivateKey, err := utils.LoadPrivateKeyWithPath("cert/apiclient_key.pem")
	if err != nil {
		log.Fatal("load merchant private key error")
	}

	ctx := context.Background()
	// Initialize client with merchant credentials and enable auto-downloading of platform certificates
	opts := []core.ClientOption{
		option.WithWechatPayAutoAuthCipher(mchID, mchCertificateSerialNumber, mchPrivateKey, mchAPIv3Key),
	}
	client, err := core.NewClient(ctx, opts...)
	if err != nil {
		log.Fatalf("new wechat pay client err: %s", err)
	}

	// Register downloader for platform certificates
	err = downloader.MgrInstance().RegisterDownloaderWithPrivateKey(ctx, mchPrivateKey, mchCertificateSerialNumber, mchID, mchAPIv3Key)
	if err != nil {
		log.Fatalf("failed to register downloader: %v", err)
	}

	// Obtain platform certificate visitor
	certVisitor := downloader.MgrInstance().GetCertificateVisitor(mchID)
	// Initialize NotifyHandler for callback processing
	handler := notify.NewNotifyHandler(mchAPIv3Key, verifiers.NewSHA256WithRSAVerifier(certVisitor))

	// Handle payment requests
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse request body JSON
		var reqData struct {
			Appid       string `json:"appid"`
			Mchid       string `json:"mchid"`
			Description string `json:"description"`
			OutTradeNo  string `json:"outTradeNo"`
			Attach      string `json:"attach"`
			Total       int64  `json:"total"`
			Openid      string `json:"openid"`
		}
		if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
			log.Println("Failed to decode request body:", err)
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		// Construct a payment request
		svc := jsapi.JsapiApiService{Client: client}
		resp, _, err := svc.PrepayWithRequestPayment(ctx,
			jsapi.PrepayRequest{
				Appid:       core.String(reqData.Appid),
				Mchid:       core.String(reqData.Mchid),
				Description: core.String(reqData.Description),
				OutTradeNo:  core.String(reqData.OutTradeNo),
				Attach:      core.String(reqData.Attach),
				NotifyUrl:   core.String("https://jmpay.cxxyonline.cn/callback"),
				Amount: &jsapi.Amount{
					Total: core.Int64(reqData.Total),
				},
				Payer: &jsapi.Payer{
					Openid: core.String(reqData.Openid),
				},
			},
		)

		if err != nil {
			log.Println("Payment request failed:", err)
			http.Error(w, "Payment request failed", http.StatusInternalServerError)
			return
		}

		// Return payment information to the mini program
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	// Handle payment callback
    // Handle payment callback
http.HandleFunc("/callback", func(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    transaction := new(map[string]interface{})
    notifyReq, err := handler.ParseNotifyRequest(context.Background(), r, transaction)
    if err != nil {
        log.Println("Failed to parse callback request:", err)
        http.Error(w, "Invalid callback data", http.StatusBadRequest)
        return
    }

    log.Printf("Callback Summary: %s", notifyReq.Summary)
    log.Printf("Transaction Data: %+v", transaction)

    transMap, ok := (*transaction)["transaction_id"]
    var transactionID string
    if ok {
        transactionID = transMap.(string)
    } else {
        log.Println("Transaction ID not found in callback data")
        http.Error(w, "Invalid callback data", http.StatusBadRequest)
        return
    }

    // ✅ 这里再从 transaction 里拿 out_trade_no 和 amount.total
    var outTradeNo string
    if v, ok := (*transaction)["out_trade_no"]; ok {
        outTradeNo = v.(string)
    }

    var total int64
    if amountRaw, ok := (*transaction)["amount"]; ok {
        if amountMap, ok2 := amountRaw.(map[string]interface{}); ok2 {
            if t, ok3 := amountMap["total"]; ok3 {
                total = int64(t.(float64)) // json 反序列化默认 float64
            }
        }
    }

    // ✅ 异步转发给 Node（不要阻塞微信回调）
    go func() {
        payload := map[string]interface{}{
            "orderNo":        outTradeNo,
            "transaction_id": transactionID,
            "total":          total,
        }
        b, _ := json.Marshal(payload)

        resp, err := http.Post(
            "https://jmzt.cxxyonline.cn/api/pay/wechat/notify",
            "application/json",
            bytes.NewReader(b),
        )
        if err != nil {
            log.Println("转发到 Node 失败:", err)
            return
        }
        defer resp.Body.Close()
        log.Println("转发到 Node 成功, status =", resp.StatusCode)
    }()

    // ✅ 立即回复微信：成功
    w.Header().Set("Content-Type", "application/xml")
    w.Write([]byte("<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>"))
    log.Printf("Callback Response Sent: <xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>")
})

    // Handle refund requests
	// Handle refund requests
	http.HandleFunc("/refund", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse refund request body JSON
		var reqData struct {
			TransactionID string `json:"transaction_id"`
			OutRefundNo   string `json:"out_refund_no"`
			Reason        string `json:"reason"`
			RefundAmount  int64  `json:"refund_amount"`
		}
		if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
			log.Println("Failed to decode request body:", err)
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		// Construct a refund request
		svc := refunddomestic.RefundsApiService{Client: client}
		resp, _, err := svc.Create(ctx,
			refunddomestic.CreateRequest{
				TransactionId: core.String(reqData.TransactionID),
				OutRefundNo:   core.String(reqData.OutRefundNo),
				Reason:        core.String(reqData.Reason),
				NotifyUrl:     core.String("https://pay.jzzw-tech.cn/refund-callback"),
				Amount: &refunddomestic.AmountReq{
					Refund: core.Int64(reqData.RefundAmount),
					Total:  core.Int64(reqData.RefundAmount), // Assuming refunding full amount
					Currency: core.String("CNY"),
				},
			},
		)

		if err != nil {
			log.Println("Refund request failed:", err)
			http.Error(w, "Refund request failed", http.StatusInternalServerError)
			return
		}

		// Return refund information to the client
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

log.Println("Starting server on :13888")
if err := http.ListenAndServe(":13888", nil); err != nil {
    log.Fatalf("Could not start server: %s\n", err.Error())
}

}
