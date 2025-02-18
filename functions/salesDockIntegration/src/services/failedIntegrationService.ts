import { serializeParams } from "../utils";

class failedIntegrationService {
  private catalystApp: any;
  private orgId: string;

  /**
   * Constructs an instance of the FailedIntegrationService.
   * @param orgId The organization ID.
   * @param catalystApp The Catalyst application instance.
   */
  constructor(orgId: string, catalystApp: any) {
    this.orgId = orgId;
    this.catalystApp = catalystApp;
  }

  /**
   * Records failed integrations into a datastore.
   * @param source The source of the integration.
   * @param destination The destination of the integration.
   * @param source_id The integration source id.
   * @param integrationPoint The specific point of integration failure.
   * @param requestData The data sent in the request.
   * @param responseError The error received in response.
   * @param message A message describing the failure.
   */
  public recordFailedIntegrations = async (
    source: string,
    destination: string,
    source_id: string,
    integrationPoint: string,
    requestData: any,
    responseError: any,
    message: string,
  ): Promise<void> => {
    try {
      const dataStore = this.catalystApp.datastore();
      const failedIntegrationTable = dataStore.table("FailedIntegrations");

      await failedIntegrationTable.insertRow({
        org_id: this.orgId,
        source: source,
        source_id: source_id,
        destination: destination,
        integration_point: integrationPoint,
        request_data: serializeParams(requestData),
        response_error: serializeParams(responseError),
        message: message,
      });
    } catch (error) {
      console.error(
        "Error initializing failed Integrations from Data Store:",
        (error as Error).message,
      );
      throw new Error(
        "Failed to initialize failed Integrations from Data Store",
      );
    }
  };
}

export default failedIntegrationService;
