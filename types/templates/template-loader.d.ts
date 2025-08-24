export function isItFile(filePathOrString: string): Promise<boolean>;
export function getTemplateContent(maybeFilePathOrString: string): Promise<string>;
export function loadTemplates(templateSet: Record<string, string>): Promise<Record<string, (params: Record<string, any>) => string>>;
