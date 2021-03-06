/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fetch from 'node-fetch'
import { config } from './config'
import { locationCache } from './locationCache'

export interface Location {
	[key: string]: string
	adminDistrict: string
	adminDistrict2: string
	countryRegion: string
	formattedAddress: string
	locality: string
	postalCode: string
}

export async function fetchLocation(zipcode: string): Promise<Location> {
	let location: Location | undefined = locationCache.get(zipcode)

	if (location !== undefined) {
		console.log(`Returning cached location for ${zipcode}.`)
		return location
	}

	console.log(
		`zipcode ${zipcode} does not exist in cache. Fetching remote data.`
	)

	const url = `${config.locationsApi}?query=${zipcode}&key=${config.locationsApiKey}`

	const results = await fetch(url).then((res) => res.json())
	location = results.resourceSets[0].resources[0].address as Location
	locationCache.set(zipcode, location)
	return location
}
