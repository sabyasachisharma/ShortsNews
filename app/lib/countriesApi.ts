interface Country {
  name: {
    common: string;
    official: string;
  }
}

const fetchCountries = async (): Promise<string[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data: Country[] = await response.json();
    
    // Sort countries alphabetically by common name
    return data
      .map(country => country.name.common)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export default fetchCountries; 