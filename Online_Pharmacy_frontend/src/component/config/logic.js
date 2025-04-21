export const isPrsesetInFavorites=(favorites,pharmacy)=>{
    for(let item of favorites){
        if(pharmacy.id===item.id){
            return true;
        }
    }
    return false;
}