package main

import (
	"context"
	"crypto/tls"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/wechatpay-apiv3/wechatpay-go/core"
	"github.com/wechatpay-apiv3/wechatpay-go/core/option"
	"github.com/wechatpay-apiv3/wechatpay-go/services/payments/jsapi"
	"github.com/wechatpay-apiv3/wechatpay-go/services/refunddomestic"
	"github.com/wechatpay-apiv3/wechatpay-go/utils"
)

// Config 配置结构体
type Config struct {
	Server struct {
		Port int `mapstructure:"port"`
		TLS  struct {
			CertFile string `mapstructure:"cert_file"`
			KeyFile  string `mapstructure:"key_file"`
		} `mapstructure:"tls"`
	} `mapstructure:"server"`
	WeChatPay struct {
		MchID                      string `mapstructure:"mch_id"`
		MchCertificateSerialNumber string `mapstructure:"mch_certificate_serial_number"`
		MchAPIv3Key                string `mapstructure:"mch_api_v3_key"`
		PrivateKeyPath             string `mapstructure:"private_key_path"`
	} `mapstructure:"wechatpay"`
	Logging struct {
		Level string `mapstructure:"level"`
		File  string `mapstructure:"file"`
	} `mapstructure:"logging"`
}

var config Config

// 初始化配置
func initConfig() error {
	viper.SetConfigName("config") // 配置文件名 (不需要扩展名)
	viper.SetConfigType("yaml")   // 配置文件类型
	viper.AddConfigPath(".")      // 当前目录
	viper.AddConfigPath("/etc/app/")
	viper.AddConfigPath("$HOME/.app")

	if err := viper.ReadInConfig(); err != nil {
		return err
	}

	if err := viper.Unmarshal(&config); err != nil {
		return err
	}

	return nil
}

// 初始化日志
func initLogging() {
	var logFile *os.File
	var err error

	if config.Logging.File != "" {
		logFile, err = os.OpenFile(config.Logging.File, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err != nil {
			log.Printf("无法打开日志文件 %s，使用标准输出: %v", config.Logging.File, err)
			logFile = os.Stdout
		}
	} else {
		logFile = os.Stdout
	}

	// 设置日志输出
	log.SetOutput(logFile)

	// 设置日志前缀和格式
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
}

// 初始化微信支付客户端
func initializeClient(ctx context.Context) (*core.Client, error) {
	// 加载商户私钥
	mchPrivateKey, err := utils.LoadPrivateKeyWithPath(config.WeChatPay.PrivateKeyPath)
	if err != nil {
		return nil, err
	}

	// 初始化客户端选项
	opts := []core.ClientOption{
		option.WithWechatPayAutoAuthCipher(
			config.WeChatPay.MchID,
			config.WeChatPay.MchCertificateSerialNumber,
			mchPrivateKey,
			config.WeChatPay.MchAPIv3Key,
		),
	}

	// 创建客户端
	client, err := core.NewClient(ctx, opts...)
	if err != nil {
		return nil, err
	}

	return client, nil
}

// RefundRequest 退款请求参数
type RefundRequest struct {
	SubMchid      string `json:"sub_mchid"`
	TransactionId string `json:"transaction_id"`
	OutTradeNo    string `json:"out_trade_no"`
	OutRefundNo   string `json:"out_refund_no"`
	Reason        string `json:"reason"`
	NotifyUrl     string `json:"notify_url"`
	FundsAccount  string `json:"funds_account,omitempty"`
	Amount        struct {
		Currency string `json:"currency"`
		From     []struct {
			Account string `json:"account"`
			Amount  int64  `json:"amount"`
		} `json:"from"`
		Refund int64 `json:"refund"`
		Total  int64 `json:"total"`
	} `json:"amount"`
	GoodsDetail []struct {
		GoodsName        string `json:"goods_name"`
		MerchantGoodsId  string `json:"merchant_goods_id"`
		RefundAmount     int64  `json:"refund_amount"`
		RefundQuantity   int64  `json:"refund_quantity"`
		UnitPrice        int64  `json:"unit_price"`
		WechatpayGoodsId string `json:"wechatpay_goods_id"`
	} `json:"goods_detail"`
}

// PaymentRequest 支付请求参数
type PaymentRequest struct {
	Appid         string    `json:"appid"`
	Mchid         string    `json:"mchid"`
	Description   string    `json:"description"`
	OutTradeNo    string    `json:"out_trade_no"`
	TimeExpire    time.Time `json:"time_expire"`
	Attach        string    `json:"attach"`
	NotifyUrl     string    `json:"notify_url"`
	GoodsTag      string    `json:"goods_tag"`
	LimitPay      []string  `json:"limit_pay"`
	SupportFapiao bool      `json:"support_fapiao"`
	Amount        struct {
		Currency string `json:"currency"`
		Total    int64  `json:"total"`
	} `json:"amount"`
	Payer struct {
		Openid string `json:"openid"`
	} `json:"payer"`
	Detail struct {
		CostPrice   int64 `json:"cost_price"`
		GoodsDetail []struct {
			GoodsName        string `json:"goods_name"`
			MerchantGoodsId  string `json:"merchant_goods_id"`
			Quantity         int64  `json:"quantity"`
			UnitPrice        int64  `json:"unit_price"`
			WechatpayGoodsId string `json:"wechatpay_goods_id"`
		} `json:"goods_detail"`
		InvoiceId string `json:"invoice_id"`
	} `json:"detail"`
	SceneInfo struct {
		DeviceId      string `json:"device_id"`
		PayerClientIp string `json:"payer_client_ip"`
		StoreInfo     struct {
			Address  string `json:"address"`
			AreaCode string `json:"area_code"`
			Id       string `json:"id"`
			Name     string `json:"name"`
		} `json:"store_info"`
	} `json:"scene_info"`
	SettleInfo struct {
		ProfitSharing bool `json:"profit_sharing"`
	} `json:"settle_info"`
}

func main() {
	// 初始化配置
	log.Println("初始化配置文件...")
	if err := initConfig(); err != nil {
		log.Fatalf("加载配置文件失败: %v", err)
	}
	log.Println("配置文件加载成功.")

	// 初始化日志
	log.Println("初始化日志...")
	initLogging()
	log.Println("日志初始化完成.")

	// 设置Gin模式为Release以移除警告
	gin.SetMode(gin.ReleaseMode)

	// 创建Gin引擎
	router := gin.Default()

	// 创建上下文
	ctx := context.Background()

	// 初始化微信支付客户端
	log.Println("初始化微信支付客户端...")
	client, err := initializeClient(ctx)
	if err != nil {
		log.Fatalf("初始化微信支付客户端失败: %v", err)
	}
	log.Println("微信支付客户端初始化成功.")

	// 创建服务实例
	refundService := refunddomestic.RefundsApiService{Client: client}
	jsapiService := jsapi.JsapiApiService{Client: client}

	// 定义路由和处理函数

	// 退款接口
	router.POST("/refund", func(c *gin.Context) {
		var refundReq RefundRequest
		if err := c.ShouldBindJSON(&refundReq); err != nil {
			log.Printf("绑定退款请求参数失败: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数错误"})
			return
		}

		// 构造退款请求
		createReq := refunddomestic.CreateRequest{
			SubMchid:      core.String(refundReq.SubMchid),
			TransactionId: core.String(refundReq.TransactionId),
			OutTradeNo:    core.String(refundReq.OutTradeNo),
			OutRefundNo:   core.String(refundReq.OutRefundNo),
			Reason:        core.String(refundReq.Reason),
			NotifyUrl:     core.String(refundReq.NotifyUrl),
		}

		if refundReq.FundsAccount != "" {
			// 使用正确的常量，例如 refunddomestic.REQFUNDSACCOUNT_AVAILABLE
			createReq.FundsAccount = refunddomestic.REQFUNDSACCOUNT_AVAILABLE.Ptr()
		}

		createReq.Amount = &refunddomestic.AmountReq{
			Currency: core.String(refundReq.Amount.Currency),
			Refund:   core.Int64(refundReq.Amount.Refund),
			Total:    core.Int64(refundReq.Amount.Total),
		}

		for _, fromItem := range refundReq.Amount.From {
			createReq.Amount.From = append(createReq.Amount.From, refunddomestic.FundsFromItem{
				// 使用正确的常量，如 refunddomestic.ACCOUNT_AVAILABLE
				Account: core.String(refunddomestic.ACCOUNT_AVAILABLE),
				Amount:  core.Int64(fromItem.Amount),
			})
		}

		for _, goods := range refundReq.GoodsDetail {
			createReq.GoodsDetail = append(createReq.GoodsDetail, refunddomestic.GoodsDetail{
				GoodsName:        core.String(goods.GoodsName),
				MerchantGoodsId:  core.String(goods.MerchantGoodsId),
				RefundAmount:     core.Int64(goods.RefundAmount),
				RefundQuantity:   core.Int64(goods.RefundQuantity),
				UnitPrice:        core.Int64(goods.UnitPrice),
				WechatpayGoodsId: core.String(goods.WechatpayGoodsId),
			})
		}

		// 调用创建退款API
		resp, result, err := refundService.Create(ctx, createReq)
		if err != nil {
			log.Printf("创建退款失败: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "退款失败"})
			return
		}

		// 返回结果
		c.JSON(result.Response.StatusCode, resp)
	})

	// 支付接口
	router.POST("/pay", func(c *gin.Context) {
		var payReq PaymentRequest
		if err := c.ShouldBindJSON(&payReq); err != nil {
			log.Printf("绑定支付请求参数失败: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数错误"})
			return
		}

		// 构造支付请求
		prepayReq := jsapi.PrepayRequest{
			Appid:         core.String(payReq.Appid),
			Mchid:         core.String(payReq.Mchid),
			Description:   core.String(payReq.Description),
			OutTradeNo:    core.String(payReq.OutTradeNo),
			TimeExpire:    core.Time(payReq.TimeExpire),
			Attach:        core.String(payReq.Attach),
			NotifyUrl:     core.String(payReq.NotifyUrl),
			GoodsTag:      core.String(payReq.GoodsTag),
			LimitPay:      payReq.LimitPay,
			SupportFapiao: core.Bool(payReq.SupportFapiao),
			Amount: &jsapi.Amount{
				Currency: core.String(payReq.Amount.Currency),
				Total:    core.Int64(payReq.Amount.Total),
			},
			Payer: &jsapi.Payer{
				Openid: core.String(payReq.Payer.Openid),
			},
			Detail: &jsapi.Detail{
				CostPrice: core.Int64(payReq.Detail.CostPrice),
			},
			SceneInfo: &jsapi.SceneInfo{
				DeviceId:      core.String(payReq.SceneInfo.DeviceId),
				PayerClientIp: core.String(payReq.SceneInfo.PayerClientIp),
				StoreInfo: &jsapi.StoreInfo{
					Address:  core.String(payReq.SceneInfo.StoreInfo.Address),
					AreaCode: core.String(payReq.SceneInfo.StoreInfo.AreaCode),
					Id:       core.String(payReq.SceneInfo.StoreInfo.Id),
					Name:     core.String(payReq.SceneInfo.StoreInfo.Name),
				},
			},
			SettleInfo: &jsapi.SettleInfo{
				ProfitSharing: core.Bool(payReq.SettleInfo.ProfitSharing),
			},
		}

		// 添加 GoodsDetail
		for _, goods := range payReq.Detail.GoodsDetail {
			prepayReq.Detail.GoodsDetail = append(prepayReq.Detail.GoodsDetail, jsapi.GoodsDetail{
				GoodsName:        core.String(goods.GoodsName),
				MerchantGoodsId:  core.String(goods.MerchantGoodsId),
				Quantity:         core.Int64(goods.Quantity),
				UnitPrice:        core.Int64(goods.UnitPrice),
				WechatpayGoodsId: core.String(goods.WechatpayGoodsId),
			})
		}

		// 调用预支付API
		resp, result, err := jsapiService.Prepay(ctx, prepayReq)
		if err != nil {
			log.Printf("创建预支付交易失败: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "支付失败"})
			return
		}

		// 返回结果
		c.JSON(result.Response.StatusCode, resp)
	})

	// 启动HTTPS服务器
	serverAddr := ":" + strconv.Itoa(config.Server.Port)

	// 加载证书和密钥
	log.Printf("加载HTTPS证书: %s 和密钥: %s", config.Server.TLS.CertFile, config.Server.TLS.KeyFile)
	cer, err := tls.LoadX509KeyPair(config.Server.TLS.CertFile, config.Server.TLS.KeyFile)
	if err != nil {
		log.Fatalf("加载HTTPS证书失败: %v", err)
	}
	log.Println("HTTPS证书加载成功.")

	// 配置TLS
	tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{cer},
	}

	// 创建HTTP服务器
	srv := &http.Server{
		Addr:      serverAddr,
		Handler:   router,
		TLSConfig: tlsConfig,
	}

	log.Printf("服务器正在监听 https://localhost%s", serverAddr)
	if err := srv.ListenAndServeTLS("", ""); err != nil && err != http.ErrServerClosed {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
