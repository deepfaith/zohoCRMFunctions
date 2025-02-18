import { serializeParams } from "../utils";

class successIntegrationService {
  private catalystApp: any;
  private orgId: string;

  /**
   * Constructs an instance of the SuccessIntegrationService.
   * @param orgId The organization ID.
   * @param catalystApp The Catalyst application instance.
   */
  constructor(orgId: string, catalystApp: any) {
    this.orgId = orgId;
    this.catalystApp = catalystApp;
  }

  /**
   * Records success integrations into a datastore.
   * @param source The source of the integration.
   * @param destination The destination of the integration.
   * @param integrationPoint The specific point of integration success.
   * @param requestData The data sent in the request.
   * @param responseError The error received in response.
   * @param message A message describing the success.
   */
  public recordSuccessIntegrations = async (
    source: string,
    destination: string,
    integrationPoint: string,
    requestData: any,
    responseSuccess: any,
    message: string,
  ): Promise<void> => {
    try {
      const dataStore = this.catalystApp.datastore();
      const failedIntegrationTable = dataStore.table("SuccessIntegrations");

      await failedIntegrationTable.insertRow({
        org_id: this.orgId,
        source: source,
        destination: destination,
        integration_point: integrationPoint,
        request_data: serializeParams(requestData),
        response_success: serializeParams(responseSuccess),
        message: message,
      });
    } catch (error) {
      console.error(
        "Error initializing success Integrations from Data Store:",
        (error as Error).message,
      );
      throw new Error(
        "Failed to initialize success Integrations from Data Store",
      );
    }
  };
}

export default successIntegrationService;
