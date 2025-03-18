import { supabase } from '../../lib/helper/supabaseClient';

export const fetchLocations = async () => {
  const { data, error } = await supabase.from('locations').select('location');
  if (error) throw new Error(error.message);
  return data;
};

export const fetchSensorData = async (locationName) => {
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .select('locationId')
      .eq('location', locationName)
      .single();
  
    if (locationError) throw new Error(locationError.message);
  
    const { data: sensorData, error: sensorError } = await supabase
      .from('sensors')
      .select('*')
      .eq('locationId', locationData.locationId)
      .order('date', { ascending: false })
      .limit(50);
  
    if (sensorError) throw new Error(sensorError.message);
  
    return sensorData;  // Return the entire sensor object
  };
  