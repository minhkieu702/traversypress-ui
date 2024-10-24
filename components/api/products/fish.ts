import { baseURL } from '@/components/config';
import { convertImageListToBinaryStrings } from '@/components/helpers/Helpers';
import { FishProductCreateModel } from '@/types/CreateModel/FishProductCreateModel';
import axios from 'axios'

const form = async (data: FishProductCreateModel) => {
    const formData= new FormData()
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.descriptionDetail) formData.append('descriptionDetail', data.descriptionDetail);
    if (data.stockQuantity) formData.append('stockQuantity', data.stockQuantity.toString());
    if (data.price) formData.append('price', data.price.toString());
    if (data.originalPrice) formData.append('originalPrice', data.originalPrice.toString());
    if (data.imageFiles){
        const imageBinaryStrings = await convertImageListToBinaryStrings(data.imageFiles)
        imageBinaryStrings.forEach((biString, index) => {
            formData.append(`imageFile${index}`, biString)
        })
    }
    formData.append('fishModel.breedId', data.fishModel.breedId);
    if (data.fishModel.size) formData.append('fishModel.size', data.fishModel.size.toString());
    if (data.fishModel.age) formData.append('fishModel.age', data.fishModel.age.toString());
    if (data.fishModel.origin) formData.append('fishModel.origin', data.fishModel.origin);
    formData.append('fishModel.sex', data.fishModel.sex.toString());
    if (data.fishModel.foodAmount) formData.append('fishModel.foodAmount', data.fishModel.foodAmount.toString());
    if (data.fishModel.weight) formData.append('fishModel.weight', data.fishModel.weight.toString());
    if (data.fishModel.health) formData.append('fishModel.health', data.fishModel.health);
    if (data.fishModel.dateOfBirth) formData.append('fishModel.dateOfBirth', data.fishModel.dateOfBirth);
    if (data.fishAward) {
        data.fishAward.forEach((award, index) => {
          if (award) {
            if (award.name) formData.append(`fishAward[${index}].name`, award.name);
            if (award.description) formData.append(`fishAward[${index}].description`, award.description);
            if (award.awardDate) formData.append(`fishAward[${index}].awardDate`, award.awardDate);
          }
        });
      }
      return formData
}
const logFormData = (formData: FormData) => {
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  };
export const handlePostProductFish = async (data: FishProductCreateModel) => {
    try {
    let formData = await form(data)
    var res = `${baseURL}/v1/product/fish`
    logFormData(formData)
    var jwtToken = localStorage.getItem('jwt');
    console.log('jwtToken', jwtToken);
    console.log(res)
    const response = await axios.post(res, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':  `Bearer ${jwtToken}`
        }
    })
    console.log('response', response);
    return response;
    } catch (error) {
      console.log('error', error)
      throw new Error(error as string);
    }
  };