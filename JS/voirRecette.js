const infoRecette = document.querySelector(".info-recette");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  .then(res => res.json())
  .then(data => {
    const meal = data.meals[0];
    infoRecette.innerHTML = `
      <div class="text">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strInstructions}</p>
      </div>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    `;
  });