#!/bin/bash
# 重启 Node.js 服务器

echo "正在查找 server.js 进程..."
PID=$(ps aux | grep "node.*server.js" | grep -v grep | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "服务器未运行，正在启动..."
    cd /root/jmzt/myxcxbkg
    nohup node server.js > /tmp/server.log 2>&1 &
    echo "服务器已启动，PID: $!"
else
    echo "找到服务器进程 PID: $PID"
    echo "正在重启服务器..."
    kill $PID
    sleep 2
    cd /root/jmzt/myxcxbkg
    nohup node server.js > /tmp/server.log 2>&1 &
    echo "服务器已重启，新 PID: $!"
fi

echo "等待服务器启动..."
sleep 3

# 测试服务器是否正常运行
if curl -s http://localhost:8088/api/products/list > /dev/null; then
    echo "✅ 服务器运行正常"
else
    echo "❌ 服务器可能未正常启动，请检查日志: tail -f /tmp/server.log"
fi
