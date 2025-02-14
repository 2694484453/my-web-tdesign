### 介绍
Node SDK 允许您使用几个配置默认项初始化 OpenTelemetry，这些默认项对于大多数用例都是正确的。

auto-instrumentations-node 包提供了对 Express 的仪表化，它会自动创建与调用库中的代码对应的跨度。在这种情况下，它提供了
Express 的仪表化，让示例应用程序自动为每个传入的请求创建跨度。

### 使用
```
npm install @opentelemetry/sdk-node \
  @opentelemetry/api \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/sdk-metrics

```

仪表化设置和配置必须在应用程序代码之前运行。一个常用于此任务的工具是–require标志。

创建一个名为 instrumentation.ts（如果不使用 TypeScript，则为 instrumentation.js）的文件，其中包含您的仪表化设置代码。

```
/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

```
### 查看
现在，您可以像往常一样运行应用程序，但可以使用 --require 标志在应用程序代码之前加载仪表化设置。

```
$ node --require ./instrumentation.js app.js
监听请求：http://localhost:8080

```

在您的Web浏览器中打开http://localhost:8080/rolldice并重新加载页面几次。过一段时间后，您应该在控制台中看到由
ConsoleSpanExporter 打印的跨度。
