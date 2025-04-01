import { runAsWorker } from 'synckit';

runAsWorker(async ({
  text, prettierEslintPath, filePath, extensionConfig,
}) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const format = await import(prettierEslintPath);
  return format.default({
    text,
    filePath,
    logLevel: 'info',
    prettierLast: extensionConfig?.prettierLast,
  });
});
