/*const ajouter = document.querySelector("#btn-ajouter");

ajouter.addEventListener("click", (event) => {
  event.preventDefault();
  const ingredients = document.querySelector("#placeholder").value;
  const afficherIngredients = document.querySelector(".afficher-ingredients");

  const ul = document.createElement("ul");
  if (ingredients === "") {
    return false;
  } else {
    ul.innerHTML = `<li>${ingredients}</li>`;
    afficherIngredients.appendChild(ul);
  }

  localStorage.setItem("ingredient", ingredients);
});

const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
const allMeals = [];
const recipesContainer = document.getElementById("recipesContainer");

Promise.all(
  alphabet.map(letter =>
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          allMeals.push(...data.meals);
        }
      })
  )
).then(() => {
  allMeals.forEach(meal => {
    const card = document.createElement("article");
    card.className = "card-recette";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="card-recette-content">
        <h3>${meal.strMeal}</h3>
        <a href="recette.html?id=${meal.idMeal}">
          <button>Voir recette</button>
        </a>
      </div>
    `;
    recipesContainer.appendChild(card);
  });
});*/

const API_KEY = "AIzaSyAl7dXtBB0hCSlxy6sBu78jK1OlBjehdMc"; 
const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
const allMeals = [];
const recipesContainer = document.getElementById("recipesContainer");
const afficherIngredients = document.querySelector(".afficher-ingredients");

// Charger toutes les recettes depuis TheMealDB
Promise.all(
  alphabet.map(letter =>
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          allMeals.push(...data.meals);
        }
      })
  )
).then(() => {
  console.log("Recettes chargées :", allMeals.length);
});

// Ajouter ingrédients à la liste
document.getElementById("btn-ajouter").addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("placeholder");
  const ingredient = input.value.trim();
  if (!ingredient) return;
  
  const ul = document.createElement("ul");
  ul.innerHTML = `<li>${ingredient}</li>`;
  afficherIngredients.appendChild(ul);

  input.value = "";
});

// Trouver recettes avec Gemini
document.getElementById("trv-recette").addEventListener("click", async () => {
  // Récupère la liste des ingrédients
  const ingredients = Array.from(afficherIngredients.querySelectorAll("li"))
    .map(li => li.textContent)
    .join(", ");
  
  if (!ingredients) {
    alert("Ajoutez d'abord des ingrédients !");
    return;
  }

  // Préparer la liste des plats pour Gemini
  const plats = allMeals.map(meal => ({
    nom: meal.strMeal,
    ingredients: [
      meal.strIngredient1, meal.strIngredient2, meal.strIngredient3,
      meal.strIngredient4, meal.strIngredient5, meal.strIngredient6
    ].filter(Boolean)
  }));

  const prompt = `
Voici une liste de plats avec leurs ingrédients :
${JSON.stringify(plats)}

Parmi ces plats, sélectionne uniquement ceux qui utilisent principalement : ${ingredients}.
Retourne uniquement les noms exacts, un par ligne, sans autre texte.
`;

  // Appel à Gemini
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    const texteIA = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const nomsPlats = texteIA.split("\n").map(n => n.trim()).filter(Boolean);

    afficherRecettes(nomsPlats);
  } catch (error) {
    console.error("Erreur Gemini :", error);
  }
});

// Affichage des cartes HTML
function afficherRecettes(nomsPlats) {
  recipesContainer.innerHTML = "";
  nomsPlats.forEach(nom => {
    const meal = allMeals.find(m => m.strMeal.toLowerCase() === nom.toLowerCase());
    if (meal) {
      const card = document.createElement("article");
      card.className = "card-recette";
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="card-recette-content">
          <h3>${meal.strMeal}</h3>
          <a href="recette.html?id=${meal.idMeal}">
            <button>Voir recette</button>
          </a>
        </div>
      `;
      recipesContainer.appendChild(card);
    }
  });
}






