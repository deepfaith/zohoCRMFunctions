const catalyst = require('zcatalyst-sdk-node');
const axios = require('axios');



async function createLeadInSalesdock(data) {
	const response = await axios.post(`${process.env.SALESDOCK_API_ENDPOINT}/leads`, {
		company: data.company,
		lastName: data.last_name,
		email: data.email
	}, {
		headers: { Authorization: `Bearer ${process.env.SALESDOCK_API_KEY}` }
	});
	return response.data;
}

async function updateLeadInSalesdock(data) {
	const response = await axios.put(`${process.env.SALESDOCK_API_ENDPOINT}/leads/${data.lead_id}`, {
		status: data.new_status
	}, {
		headers: { Authorization: `Bearer ${process.env.SALESDOCK_API_KEY}` }
	});
	return response.data;
}

async function convertLeadToCustomer(data) {
	const response = await axios.post(`${process.env.SALESDOCK_API_ENDPOINT}/leads/${data.lead_id}/convert`, {}, {
		headers: { Authorization: `Bearer ${process.env.SALESDOCK_API_KEY}` }
	});
	return response.data;
}


module.exports = async (event, context) => {
	/*
        EVENT FUNCTIONALITIES
    */
	const DATA = event.data; //event data
	const TIME = event.time; //event occured time

	const SOURCE_ACTION = event.getAction(); //(insert | fetch | invoke ...)
	const SOURCE_TYPE = SOURCE_DETAILS.type; //(datastore | cache | queue ...)
	const SOURCE_ENTITY_ID = SOURCE_DETAILS.entityId; //if type is datastore then entity id is tableid

	const SOURCE_BUS_DETAILS = SOURCE_DETAILS.getBusDetails(); //event bus details
	const SOURCE_BUS_ID = SOURCE_BUS_DETAILS.id; //event bus id

	// const PROJECT_DETAILS = event.getProjectDetails(); //event project details
	// const FUNCTION_DETAILS = event.getFunctionDetails(); //event function details

	const catalystApp = catalyst.initialize(context);
	const requestData = event.data;
	const eventType = requestData.event;

	console.log('SOURCE_DETAILS from Zoho', SOURCE_DETAILS);
	console.log('SOURCE_ACTION from Zoho', SOURCE_ACTION);
	console.log('SOURCE_TYPE from Zoho', SOURCE_TYPE);
	console.log('SOURCE_ENTITY_ID from Zoho', SOURCE_ENTITY_ID);
	console.log('SOURCE_BUS_DETAILS from Zoho', SOURCE_BUS_DETAILS);
	console.log('SOURCE_BUS_ID from Zoho', SOURCE_BUS_ID);
	console.log('Event data from Zoho', requestData);

	switch(eventType) {
		case 'lead.created':
			await createLeadInSalesdock(requestData);
			break;
		case 'lead.updated':
			await updateLeadInSalesdock(requestData);
			break;
		case 'deal.won':
			await convertLeadToCustomer(requestData);
			break;
		default:
			console.log('Unhandled event:', eventType);
	}

	console.log('Hello from index.js');

	/*
        CONTEXT FUNCTIONALITIES
    */
	context.closeWithSuccess(); //end of application with success
	// context.closeWithFailure(); //end of application with failure

};
