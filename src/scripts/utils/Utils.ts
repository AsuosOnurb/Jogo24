


    

    export  function  RandomInt(lowerbound: number, upperbound: number) : number
    {
        let min = Math.ceil(lowerbound);
        let max = Math.floor(upperbound);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


