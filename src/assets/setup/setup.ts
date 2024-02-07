export type AppSetup = {
	apiUrl: string
	clientName: string
	copyright: string
	poweredByLabel: string
	sampleApiCalls: string
	google_maps_api_key: string
	geography_api_key: string
	loginPageSplashImage: string
	logo: string
	anjosAccount: {
		account: string,
		address: string,
		buildingNumber: string | number,
		city: string,
		country: string,
		name: string,
		zip: string | number
	}
}