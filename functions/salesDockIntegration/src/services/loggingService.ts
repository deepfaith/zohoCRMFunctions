import FormData from "form-data";
import { serializeParams } from "../utils";

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
        params: serializeParams(params),
      });
    } catch (error) {
      console.error(
        "Error initializing logs from Data Store:",
        (error as Error).message,
      );
      throw new Error("Failed to initialize logs from Data Store");
    }
  };
}

export default LoggingService;
