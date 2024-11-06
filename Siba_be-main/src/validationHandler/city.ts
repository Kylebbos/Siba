import {
    createIdValidatorChain,
    createNameValidatorChain,
    createDateValidatorChain,
    createDecimalValidatorChain,
    validateIdObl,
    validateNameObl,
  } from './index.js';

  export const validateCityId = [...createIdValidatorChain('cityId')];

  export const validateCityPost = [
    ...validateNameObl,
    ...createDateValidatorChain('established'),
    ...createDecimalValidatorChain('averageTemp', 1),
  ];

  export const validateCityPut = [
    ...validateCityPost,
    ...validateIdObl,
  ];
  
  export const validateCitySearchText = [
    ...createNameValidatorChain('searchText'),
  ];
  
  export const validateCityEstablishedDate = [
    ...createDateValidatorChain('date'),
  ];
  