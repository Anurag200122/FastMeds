export const categorizedDossage=(dossage)=>{
    return dossage.reduce((acc,dossage)=>{
        const {category}=dossage;
        if(!acc[category.name]){
            acc[category.name]=[];
        }
        acc[category.name].push(dossage);
        return acc;
    },{})
};