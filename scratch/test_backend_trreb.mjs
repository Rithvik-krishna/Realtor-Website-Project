import { trrebService } from '../dist/services/trrebService.js';

async function testBackendService() {
  console.log('Fetching live TRREB MLS properties via TRREBService...');
  const result = await trrebService.getProperties({ top: 10, city: 'Toronto' });
  console.log('Result count:', result.count);
  console.log('Fetched properties:', result.properties.length);
  if (result.properties.length > 0) {
    const p = result.properties[0];
    console.log('✨ REAL LIVE TRREB PROPERTY LOADED:', {
      MLS: p.mlsNumber,
      Address: p.address,
      City: p.city,
      Price: '$' + p.price.toLocaleString(),
      Office: p.listOfficeName,
      ImagesCount: p.images.length,
      FirstImage: p.imageUrl,
      Lat: p.lat,
      Lng: p.lng
    });
  }
}

testBackendService();
