import leadIntegrationService from "./services/leadIntegrationService";
import catalyst from "zcatalyst-sdk-node";

module.exports = (event: any, context: any) => {
  const eventData = event.getData();
  const eventType: string = eventData.signal_info.generic_api_name;
  const orgId: string = eventData.publisher.org_id;
  const catalystApp = catalyst.initialize(context);

  const integration = new leadIntegrationService(catalystApp, orgId);
  const leadId = eventData.event_data[0].id as string;
  integration
    .getLead(leadId)
    .then(async (leadCustomer) => {
      // integration
      //   .handleCrmEvent(eventType, leadCustomer)
      //   .then((data) => {
      //     console.log("CRM event handled successfully", data);
      //     context.closeWithSuccess();
      //   })
      //   .catch((error) => {
      //     console.error("Error handling CRM event:", (error as Error).message);
      //     context.closeWithFailure();
      //   });
      await integration
        .getLoggingService()
        .createLog(
          "getLead",
          "Retrieves a lead by ID from Zoho CRM.",
          "SUCCESS",
          leadCustomer,
        );
      console.log("Retrieves a lead by ID from Zoho CRM", leadCustomer);

      context.closeWithSuccess();
    })
    .catch(async (error) => {
      const errorMessage = `Error retrieving a lead by ID from Zoho CRM: ${(error as Error).message}`;
      console.error(errorMessage);
      await integration
        .getLoggingService()
        .createLog("getLead", errorMessage, "ERROR", { leadId: leadId });

      context.closeWithFailure();
    });
};
