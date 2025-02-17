import { getLeadById } from "../entities/zoho";
import {
  convertLeadToCustomer,
  createLeadInSalesdock,
  updateLeadInSalesdock,
} from "../entities/salesdock";
import zohoAuthService from "./zohoAuthService";
import LoggingService from "./loggingService";

/**
 * Service class for Zoho CRM operations.
 */
class LeadIntegrationService {
  private authService: zohoAuthService;

  constructor(catalystApp: any, orgId: string) {
    this.authService = new zohoAuthService(orgId, catalystApp);
  }

  /**
   * Retrieves a lead by ID from Zoho CRM.
   * @param leadId The ID of the lead to retrieve.
   * @returns A promise that resolves to the lead data, or null if the request fails.
   */
  public getLead = async (leadId: string): Promise<any> => {
    await this.authService.initializeTokens();
    return {
      ...(await getLeadById(this.authService, leadId)),
      tokens: this.authService.getAccessTokens(),
    };
  };

  /**
   * Processes CRM events and executes corresponding actions in Salesdock.
   * @param eventType The type of the event.
   * @param requestData The data associated with the event.
   */
  public handleCrmEvent = async (
    eventType: string,
    requestData: any,
  ): Promise<any> => {
    switch (eventType) {
      case "Crm_New_Leads__s":
        return await this.createLead(requestData);
        break;
      case "Crm_Update_Leads__s":
        return await this.updateLead(requestData);
        break;
      case "Crm_Won_Deal__s":
        return await this.convertLead(requestData);
        break;
      default:
        throw new Error(`Unhandled event: ${eventType}`);
    }
  };

  /**
   * Creates a new lead in Salesdock.
   * @param data The lead data to create.
   * @returns A promise that resolves to the created lead data.
   */
  private createLead = async (data: any): Promise<any> => {
    const requestData = {
      firstname: data.First_Name ?? "",
      postcode: data.Zip_Code ?? "",
      streetname: data.Street ?? "",
      city: data.City ?? "",
      email: data.Email ?? "",
      phone: (data.Phone || data.Mobile) ?? "",
      business: data.Company ? "1" : "0",
      company_name: data.Company ?? "ZohoCRM",
    };

    // const requestData = {
    //   gender: "female",
    //   firstname: data.First_Name ?? "",
    //   postcode: data.Zip_Code ?? "",
    //   housenumber: "9",
    //   streetname: data.Street ?? "",
    //   city: "Enschede",
    //   birthdate: "01-01-1990",
    //   email: data.Email ?? "",
    //   phone: data.Phone ?? "",
    //   business: data.Company ? "1" : "0",
    //   company_name: data.Company ?? "",
    //   contact_person: "John Alan Doe",
    //   coc: "01234567",
    //   vat: "NL12345678",
    //   user: 2916,
    //   planned_for_date: "1",
    //   planned_date: "20-04-2021",
    //   start_at: "10:00",
    //   end_at: "11:00",
    //   cf_bankrekeningnur: "NL91ABNA0417164300",
    //   "question_payment-method": "Manual",
    //   lead_source_id: "86587",
    //   labels: [20],
    // };
    return await createLeadInSalesdock(requestData, data.tokens.salesDockToken);
  };

  /**
   * Updates a lead in Salesdock.
   * @param data The lead data to update.
   * @returns A promise that resolves to the updated lead data.
   */
  private updateLead = async (data: any): Promise<any> => {
    return await updateLeadInSalesdock(data, data.tokens.salesDockToken);
  };

  /**
   * Converts a lead to a customer in Salesdock.
   * @param data The lead data to convert.
   * @returns A promise that resolves to the converted customer data.
   */
  private convertLead = async (data: any): Promise<any> => {
    return await convertLeadToCustomer(data, data.tokens.salesDockToken);
  };

  public getLoggingService = (): LoggingService => {
    return this.authService.getLoggingService();
  };
}

export default LeadIntegrationService;
