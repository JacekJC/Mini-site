import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import model_tile_styles from '@/styles/model_tile_styles.module.css';
import models_page_styles from '@/styles/models_page_styles.module.css';



export default function get_models()
{
    const router = useRouter();
    const { filters } = router.query;

    const [displayed_models, set_displayed_models] = useState([]);
    const [displayed_models_thumbnails, set_displayed_models_thumbnails] = useState([]);
    var current_index = 0;

    async function load_models(amount: number){
        const d = await fetch('http://127.0.0.1:8000/models/' + 'none' + '/' + 0 + '/' + 10)
        const new_d = await d.json();
        set_displayed_models((prev_state) => [...prev_state, new_d[0]]);
        console.log(new_d);
        let acc_data = new_d[0];
        acc_data.forEach((element) => 
        {
            get_model_thumbnail(element[0]);
            console.log('newThumbnailGot');
        })
    }

    async function get_model_thumbnail(model_id: number){

        const new_img = await fetch('http://127.0.0.1:8000/get_model/' + model_id + '/thumbnail');
        const res = await new_img.blob();
        const url = URL.createObjectURL(res);
        console.log("GOT URL : ", url);
        set_displayed_models_thumbnails((prev_state) => [...prev_state, url]);
        return url;
    }

    useEffect(() => {
        set_displayed_models_thumbnails([]);
        load_models(10);
    }, [])

    return (
        <>
            <p> Filters : {filters} </p>
            <p> model name </p>
            <p> model price </p>
            <div className={models_page_styles.models_grid}>
                <Model_list models={displayed_models} thumbnails={displayed_models_thumbnails}></Model_list>
            </div>
        </>
    )
}

export function Model_list(props)
{
    const thumbnails = props.thumbnails;
    const models = props.models;

    if(models == undefined)
    return <p> no value </p>;

    console.log(models.length)
    console.log(thumbnails);

    return models.map((val : [], index : number) => {
        return <div class={model_tile_styles.model_tile} id={val[0]} key={index}> 
            <p> {val} </p>
            <img src = {thumbnails[index]}></img>
        </div>;
        }
    )
}