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
   * Retrieves a record from the SuccessIntegrations table based on the source and source_id.
   * @param {string} source - The source identifier for the integration.
   * @param {number} source_id - The unique ID associated with the source.
   * @returns {Promise<any>} A promise that resolves to the record if found, otherwise null.
   */
  public getRecordSuccessIntegrationBySource = async (
    source: string,
    source_id: number,
  ): Promise<any> => {
    try {
      const zcql = this.catalystApp.zcql();
      const query = `SELECT *
                     FROM SuccessIntegrations
                     WHERE source = '${source}'
                       AND source_id = '${source_id}' LIMIT 1`;
      const records = await zcql.executeZCQLQuery(query);
      return records.length > 0 ? records[0].SuccessIntegrations : null;
    } catch (error) {
      console.error(
        "Error fetching access SuccessIntegrations:",
        (error as Error).message,
      );
      throw new Error(
        "Failed to fetch access SuccessIntegrations from Data Store",
      );
    }
  };

  /**
   * Records success integrations into a datastore.
   * @param source The source of the integration.
   * @param destination The destination of the integration.
   * @param integrationPoint The specific point of integration success.
   * @param requestData The data sent in the request.
   * @param responseSuccess The response from the request.
   * @param message A message describing the success.
   * @param source_id The integration source id.
   * @param destination_id The integration destination id.
   */
  public recordSuccessIntegrations = async (
    source: string,
    destination: string,
    integrationPoint: string,
    requestData: any,
    responseSuccess: any,
    message: string,
    source_id: number,
    destination_id: number,
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
        source_id: source_id,
        destination_id: destination_id,
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
