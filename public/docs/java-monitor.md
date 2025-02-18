### 1.添加pom.xml依赖

```
<dependencies>
    <!-- Spring Boot Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
        <version>2.7.15</version>
    </dependency>
    <!-- Micrometer Prometheus Registry -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
        <version>1.9.14</version>
    </dependency>
</dependencies>

```

### 2.添加application.yml配置

```
management:
  endpoints:
    web:
      exposure:
        include: '*'
  metrics:
    export:
      prometheus:
        enabled: true

```

其他属性配置:

```
management.endpoints.web.exposure.include=* # 暴露所有端点
management.metrics.export.prometheus.enabled=true #启用Prometheus导出器
management.endpoints.web.base-path=“/status” # 将/actuator/xxx修改为/status/xxx，防止被猜到
management.endpoints.server.request.metric-name=“application:request” # 自定义接口指标名
management.server.port=10001 #指定端口,默认跟server.port一样，可以防止被猜到

```
