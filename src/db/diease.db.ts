import Disease from "../models/disease.model";

async function getDiseases() {
  const diseases = await Disease.find({});
  return diseases;
}

export default { getDiseases };
