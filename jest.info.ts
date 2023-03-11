import * as os from "os";

export default function () {
  const info = {
    OS: `${os.type()} ${os.release()}`,
    CPU: `${os.arch()} ${os.cpus()[0].model}`,
    RAM: `${(os.totalmem() / Math.pow(1024, 3)).toFixed(2)} GB`,
  };

  process.env.JEST_HTML_REPORTERS_CUSTOM_INFOS = JSON.stringify(info);
}
