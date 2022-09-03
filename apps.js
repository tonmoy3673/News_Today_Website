// =====get all categories======//

const loadNews = async () => {
    const url = 'https://openapi.programming-hero.com/api/news/categories'
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.data.news_category;
    } catch (error) {
        console.log(error);
    }

}

const setCategory = async () => {
    const data = await loadNews()

    const allCategory = document.getElementById('menu-bar');

    const uniqueArray = [];

    for (const category of data) {
        

        if (uniqueArray.indexOf(category.category_name) === -1) {
            uniqueArray.push(category.category_name);
           

            const li = document.createElement('li');
            li.innerHTML = `
            <a onclick="loadAllNews('${category.category_id}')" class="nav-link btn btn-primary text-white ms-3 mt-2">${category.category_name}</a>
            `;
            allCategory.appendChild(li);
        }
    }

}

setCategory();

// =============Spinner===========//
const toggleSpinner = isLoading => {
    const spinnerSection = document.getElementById('spinner');
    if (isLoading) {
        spinnerSection.classList.remove('d-none')
    } else {
        spinnerSection.classList.add('d-none')
    }
}

const loadAllNews = async (category_id) => {

    // ===========Spinner Start======//
    toggleSpinner(true);

    const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;

    const res = await fetch(url);
    const data = await res.json();
    displayNewsItem(data.data);
}

const displayNewsItem = newsAll => {
    

    
    newsAll.sort((a, b) => {
        return b.total_view - a.total_view;
    });

    const newsCount = document.getElementById('news-count').innerHTML = `${newsAll.length} items found for category`;


    // =============No News==============//
    const noNews = document.getElementById('no-news-category');
    if (newsAll.length === 0) {
        noNews.classList.remove('d-none');
    }
    else {
        noNews.classList.add('d-none');
    }


    
    const newsContainer = document.getElementById('news-container');
    newsContainer.textContent = '';
    newsAll.forEach(news => {


        const div = document.createElement('div');
        div.innerHTML = `
        <div class="container card mb-3"">
        <div class="row g-0">
        <div class="col-md-4">
         <img src=${news.thumbnail_url}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
         <div class="card-body">
         <h5 class="card-title">${news.title ? news.title : 'Title not found'}</h5>
         <p class="card-text">${news.details.length > 300 ? news.details.slice(0, 300) + '...' : news.details}</p>


        
         <div class="mb-3 mt-5" >
            <div class="d-flex justify-content-between row g-0">
                <div class="col-md-2">
                    <img src="${news.author.img ? news.author.img : 'Author Image not found'}" style="width: 50px; height: 50px;" class="rounded-circle" alt="...">
                </div>
                <div class="col-md-4">
                    <h5 class="title">${news.author.name ? news.author.name : 'Author is not found'}</h5>
                    <p class="text">${news.author.published_date ? news.author.published_date : 'Author Published date not found'}</p>

                </div>

                <div class="col-md-4">
                    <h5 class="title"><i class="fa-regular fa-eye"></i> ${news.total_view ? news.total_view : 'View is not found'}</h5>
                </div>
                <div class="col-md-2">
                    <h5 onclick="loadNewsDetails('${news._id}')" class="title" data-bs-toggle="modal" data-bs-target="#detailsModal"><i class="fa-solid fa-arrow-right"></i></h5>
                </div>
            </div>
        </div>
        

      </div>
    </div>
  </div>
</div>
        `;
        newsContainer.appendChild(div);
    })

    // =============Spinner Stop==============//
    toggleSpinner(false);

}

const loadNewsDetails = async news_id => {
    const url = `https://openapi.programming-hero.com/api/news/${news_id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayNewsDetails(data.data[0]);
}

const displayNewsDetails = newsDetails => {
    const modalTitle = document.getElementById('detailsModalTitle');
    modalTitle.innerText = newsDetails.title;

    const modelDetails = document.getElementById('model-details');
    modelDetails.innerHTML = `
    <div class="card" >
    <img src="${newsDetails.thumbnail_url}" class="card-img-top" alt="...">
    <div class="card-body">
    <p class="card-text">${newsDetails.details}</p>
    </div>
    </div>
    

    <div class="mb-3 mt-5" >
            <div class="d-flex justify-content-between row g-0">
                <div class="col-md-2">
                    <img src="${newsDetails.author.img ? newsDetails.author.img : 'Author Image not found'}" style="width: 50px; height: 50px;" class="rounded-circle" alt="...">
                </div>
                <div class="col-md-6">
                    <h5 class="title">${newsDetails.author.name ? newsDetails.author.name : 'Author is not found'}</h5>
                    <p class="text">${newsDetails.author.published_date ? newsDetails.author.published_date : 'Author Published date not found'}</p>

                </div>

                <div class="col-md-4">
                    <h5 class="title"><i class="fa-regular fa-eye"></i> ${newsDetails.total_view ? newsDetails.total_view : 'View is not found'}</h5>
                </div>
            </div>
        </div>
    `;
}