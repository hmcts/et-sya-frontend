export interface typeOfClaim {
  jurisdictionCodesList: jurisdictionCodes[];
}

// Sample codes, there are many, Investigation for which ones apply to us
export enum jurisdictionCodes {
  ADT = 'ADT', // Discriminatory terms or rules
  DAG = 'DAG', // Discrimination, including harassment or victimisation or discrimination based on association or perception on grounds of age
  EQP = 'EQP', // Failure to provide equal pay for equal value work
}
