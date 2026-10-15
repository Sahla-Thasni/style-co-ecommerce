import api from "./api";

export const getProductReviews = async (productId: number) => {
  const response = await api.get(`/products/${productId}/reviews/`);

  return response.data;
};

export const createProductReview = async (
  productId: number,
  rating: number,
  comment: string,
) => {
  const response = await api.post(`/products/${productId}/reviews/`, {
    rating,
    comment,
  });

  return response.data;
};

export const getReviewEligibility = async (productId: number) => {
  const response = await api.get(`/products/${productId}/reviews/eligibility/`);

  return response.data;
};
