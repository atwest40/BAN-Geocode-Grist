grist.ready();

grist.onRecord((record) => {
    if (record && record.address) {
        document.getElementById('address').value = record.address;
    }
});

document.getElementById('fetch').addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    if (!address) {
        alert('Please enter an address');
        return;
    }

    try {
        const polygon = await fetchPostcodePolygon(address);
        grist.setCellValue('Polygon', JSON.stringify(polygon));
        document.getElementById('result').innerText = JSON.stringify(polygon, null, 2);
    } catch (error) {
        console.error('Error fetching polygon:', error);
        document.getElementById('result').innerText = 'Error fetching polygon data';
    }
});

async function fetchPostcodePolygon(address) {
    const postcode = await geocodeAddress(address);
    const response = await fetch(`https://api.example.com/postcode/${postcode}/polygon`);
    if (!response.ok) {
        throw new Error('Failed to fetch polygon data');
    }

    const data = await response.json();
    return data.polygon;
}

async function geocodeAddress(address) {
    const response = await fetch(`https://api.example.com/geocode?address=${encodeURIComponent(address)}`);
    if (!response.ok) {
        throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    return data.postcode;
}
