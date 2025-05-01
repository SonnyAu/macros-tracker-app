export interface NutritionData {
  foodItem: {
    name: string;
    servingSize: {
      amount: number;
      unit: string;
    };
    nutrition: {
      calories: number;
      macros: {
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
      };
      micronutrients: {
        sodium: number;
        potassium: number;
        cholesterol: number;
        vitaminA: number;
        vitaminC: number;
        calcium: number;
        iron: number;
      };
    };
  };
}
