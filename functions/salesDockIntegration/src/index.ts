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
      if (!leadCustomer)
        throw new Error("Error retrieving a lead by ID from Zoho CRM");
      integration
        .handleCrmEvent(eventType, leadCustomer)
        .then(async (data) => {
          if (data.responseStatus) {
            await integration
              .getLoggingService()
              .createLog(
                "handleCrmEvent",
                "CRM event handled successfully",
                "SUCCESS",
                { event: eventType, fromSalesDock: data },
              );
            console.log("CRM event handled successfully:", data);
            context.closeWithSuccess;
          } else {
            const errorMessage = `Error handling CRM event`;
            console.error(errorMessage);
            await integration
              .getLoggingService()
              .createLog("handleCrmEvent", errorMessage, "ERROR", data);
            context.closeWithFailure();
          }
        })
        .catch(async (error) => {
          const errorMessage = `Error handling CRM even: ${(error as Error).message}`;
          console.error(errorMessage);
          await integration
            .getLoggingService()
            .createLog("handleCrmEvent", errorMessage, "ERROR", {
              event: eventType,
              leadId: leadId,
            });

          context.closeWithFailure();
        });
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
