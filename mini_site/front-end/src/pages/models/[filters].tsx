import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import model_tile_styles from '@/styles/model_tile_styles.module.css';
import models_page_styles from '@/styles/models_page_styles.module.css';



export default function get_models()
{
    const router = useRouter();
    const { filters } = router.query;

    const [displayed_models, set_displayed_models] = useState();
    const [displayed_models_thumbnails, set_displayed_models_thumbnails] = useState();
    var current_index = 0;

    async function load_models(amount: number){
        const d = await fetch('http://127.0.0.1:8000/models/' + 'none' + '/' + 0 + '/' + 10)
        const new_d = await d.json();
        set_displayed_models((prev_state) => [...prev_state, new_d[0]]);
        let acc_data = new_d[0];
        acc_data.forEach((element) => 
        {
            get_model_thumbnail(element[0]);
        })
    }

    async function get_model_thumbnail(model_id: number){

        const new_img = await fetch('http://127.0.0.1:8000/get_model/' + model_id + '/thumbnail');
        const res = await new_img.blob();
        const url = URL.createObjectURL(res);
        if(displayed_models_thumbnails == undefined || displayed_models_thumbnails.length < model_id)
        {
            set_displayed_models_thumbnails((prev_state) => [...prev_state, url]);
        }
        return url;
    }

    useEffect(() => {
        if(displayed_models == undefined && current_index == 0)
        {
            set_displayed_models([]);
            set_displayed_models_thumbnails([]);
            load_models(10);
            current_index = 10;
        }
    }, [])

    return (
        <>
            <p> Filters : {filters} </p>
            <div className={models_page_styles.models_grid}>
                <Model_list models={displayed_models} thumbnails={displayed_models_thumbnails}></Model_list>
            </div>
        </>
    )
}

export function Model_list(props)
{
    const thumbnails = props.thumbnails;
    const pre_models = props.models;

    if(pre_models == undefined || pre_models.length == 0)
        return <p> no value </p>;

    const models = pre_models[0];
    console.log(models);

    return models.map((val : [], index : number) => {
        console.log(val);
        return <div class={model_tile_styles.model_tile} id={val[0]} key={index}> 
            <p> {val} </p>
            <img src = {thumbnails[index]}></img>
        </div>;
        }
    )
}