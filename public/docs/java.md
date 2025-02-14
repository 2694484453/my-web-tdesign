### 1.下载

<p>
从opentelemetry-java-instrumentation仓库的Releases(<https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases>)中下载opentelemetry-javaagent.jar，并将JAR文件放置在您偏好的目录中。该JAR文件包含代理和仪表化库。
</p>
<br/>

### 2.使用

<p>
将-javaagent:path/to/opentelemetry-javaagent.jar和其他配置添加到JVM启动参数中，并启动您的应用程序：
</p>
<br/>
<ul>
<li>
<strong>方式1：直接在启动命令中添加:</strong>

```
java -javaagent:path/to/opentelemetry-javaagent.jar -Dotel.service.name=your-service-name -jar myapp.jar
    
 ```

</li>
<li>
<strong>方式2：通过JAVA_TOOL_OPTIONS和其他环境变量添加：</strong>

```
export JAVA_TOOL_OPTIONS="-javaagent:path/to/opentelemetry-javaagent.jar"
export OTEL_SERVICE_NAME="your-service-name"
java -jar myapp.jar

```

</li>

<li>
<strong>方式3：项目中引入式添加：</strong>
pom中添加：

```
<!-- otlp -->
   <dependency>
       <groupId>io.opentelemetry.instrumentation</groupId>
       <artifactId>opentelemetry-spring-boot-starter</artifactId>
   </dependency>
```

application.yml中添加:

```
#链路追踪
otel:
  service:
    name: ${spring.application.name}-${os.name}
  exporter:
    otlp:
      endpoint: http://124.221.2.29:4318
      timeout: 10s
```

</li>
</ul>

