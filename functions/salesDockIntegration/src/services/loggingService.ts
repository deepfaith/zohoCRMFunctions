import FormData from "form-data";

class LoggingService {
  private catalystApp: any;
  private orgId: string;

  constructor(orgId: string, catalystApp: any) {
    this.orgId = orgId;
    this.catalystApp = catalystApp;
  }

  /**
   * Creates a log entry in the datastore.
   * @param {string} action - The action being logged.
   * @param {string} message - The message of the log.
   * @param {string} logLevel - The severity level of the log.
   * @param {Record<string, unknown>} params - Additional parameters for the log.
   */
  public createLog = async (
    action: string,
    message: string,
    logLevel: string,
    params: any,
  ): Promise<void> => {
    try {
      const dataStore = this.catalystApp.datastore();
      const logsTable = dataStore.table("Logs");

      await logsTable.insertRow({
        org_id: this.orgId,
        action: action,
        message: message,
        updated_at: new Date().toISOString(),
        log_level: logLevel,
        params: this.serializeParams(params),
      });
    } catch (error) {
      console.error(
        "Error initializing logs from Data Store:",
        (error as Error).message,
      );
      throw new Error("Failed to initialize logs from Data Store");
    }
  };

  /**
   * Serializes various types of `params` into a string format.
   *
   * @param {any} params - The parameter value to be serialized.
   * @returns {string} - A string representation of the parameter.
   *
   * - If `params` is an `Error` object, it extracts `name`, `message`, and `stack`.
   * - If `params` is `FormData`, it converts it to a URL-encoded string.
   * - If `params` is an object, it converts it to JSON.
   * - If `params` throws an error during serialization, it logs a fallback error message.
   */
  private serializeParams = (params: any): string => {
    try {
      if (params instanceof Error) {
        return JSON.stringify({
          name: params.name,
          message: params.message,
          stack: params.stack,
        });
      }
      return JSON.stringify(params);
    } catch (error) {
      return `Serialization Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  };
}

export default LoggingService;
