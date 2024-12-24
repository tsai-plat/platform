#

## ssltool

```bash
bash bin/ssltool.sh --ssl-trusted-ip=127.0.0.1 \

```

- 验证证书

```bash
cd apps/tsai-admin/.conf/secrets
openssl verify -CAfile cakey.pem tls.crt
```


```bash
export basedir=./.secrets
# 1. 生成RSA密钥对
openssl genrsa -des3 -out $basedir/server-pairs.key 2048
# 2. 对RSA私钥进行解密，并重新保存到server.key
openssl rsa -in $basedir/server-pairs.key -out $basedir/server.key

# 3. 生成证书签名server.csr
openssl req -new -key $basedir/server.key -out $basedir/server.csr

# 4. 生成一个十年的自签名证书ca.crt
openssl req -new -x509 -key $basedir/server.key -out $basedir/ca.crt -days 3650

# 5. 生成自签名证书server.crt
openssl x509 -req -days 3650 -in $basedir/server.csr -CA $basedir/ca.crt -CAkey $basedir/server.key -CAcreateserial -out $basedir/server.crt

# copy to app
cp $basedir/server.crt 

```
