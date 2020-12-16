// naming conventions of items in svg = id of group in camelCase, image import name in PascalCase.
// svg tree generated from dev/svgParse.py (super hacky atm)


import React, { useEffect, useState } from "react";
import "./index.css";
import { Location } from "../../lib/types"

// Image import - since require is not allowed anymore, reverting to the plague imports
import BackgroundImage from './assets/tuckermap.jpeg';
import AquaOcean from './assets/locations/AquaOcean.png';
import BananaBunches from './assets/locations/BananaBunches.png';
import BushLand from './assets/locations/BushLand.png';
import CluckyCoop from './assets/locations/CluckyCoop.png';
import CoolCloud from './assets/locations/CoolCloud.png';
import DairyPark from './assets/locations/DairyPark.png';
import FruityOrchard from './assets/locations/FruityOrchard.png';
import GrainField from './assets/locations/GrainField.png';
import GrazingLands from './assets/locations/GrazingLands.png';
import HealthyTown from './assets/locations/HealthyTown.png';
import SupplyStore from './assets/locations/SupplyStore.png';
import VegieZone from './assets/locations/VegieZone.png';
import WickedWaterway from './assets/locations/WickedWaterway.png';
import YoghurtMountains from './assets/locations/YoghurtMountains.png';

interface Props {
    selected: Location | null;
    onSelect: (c: Location | null) => void;
    height: number
}

export const Map: React.FC<Props> = ({ selected, onSelect, height }: Props) => {
    // const height ="100%";

    const [audio, setAudio] = useState({
        sound: new Audio(),
        playing: false,
        change: false
    });

    const playSound = (url: string) => {
        setAudio({
            sound: new Audio(url),
            playing: true,
            change:true
        })
    }

    useEffect(() => {
        audio.playing ? audio.sound.play() : audio.sound.pause();

        if(audio.change){
            setAudio({
                sound: audio.sound,
                playing: audio.playing,
                change:false
            })
        }

    },
        [audio.playing, audio.change]
    );

    useEffect(() => {
        audio.sound.addEventListener('ended', () => {
            setAudio({
                sound: audio.sound,
                playing: false,
                change:true
            });
        }
        );
        return () => {
            audio.sound.removeEventListener('ended', () => setAudio({
                sound: audio.sound,
                playing: false,
                change:true
            }));
        };
    }, [audio.playing]);

    const getClassname = (area: Location) => {
        if (area === selected) {
            return 'map-selected';
        } else {
            return 'map-unselected';
        }
    }

    const onMapClick = (area: Location) => {
        console.log(area);
        if (selected === area) {
            onSelect(null);
        } else {
            onSelect(area);
        }

        if (area == "grainField" || area == "bananaBunches" || area == "aquaOcean" || area == "zombieWasteland") {
            playSound("https://freesound.org/data/previews/547/547685_12172648-lq.mp3")
        }
        else if (area == "coolCloud" || area == "supplyStore" || area == "grazingLands" || area == "dairyPark") {
            playSound("https://freesound.org/data/previews/547/547491_12277875-lq.mp3")
        }
        else playSound("https://freesound.org/data/previews/547/547443_6397342-lq.mp3")
    }

    const getSVGLocationGroup = (name: Location, width: number, height: number, transform: string, image: string) => {
        return (
            <g id={name} onClick={() => onMapClick(name)}>
                <g transform={transform}>
                    <image width={width} height={height} className={getClassname(name)} xlinkHref={image} />
                </g>
            </g>
        )
    }

    // Data can be made from dev/svgParse.py

    return (
        <div className="svgrow">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 490.56" height={height} overflow="scroll">
                <g id="bg"><image width="7151" height="3508" transform="scale(0.14)" xlinkHref={BackgroundImage} /></g>

                {getSVGLocationGroup("bushLand", 940, 757, "translate(0 158) scale(0.139 0.14)", BushLand)}


                {/* Leaving unselectable for now */}
                <g id="zombieWasteland" className={"map-unselected"} onClick={() => console.log("I am zombie")} ><rect x="92" y="405" width="151" height="69" opacity="0.2" /></g>

                {getSVGLocationGroup("wickedWaterway", 1216, 842, "translate(358 227) scale(0.141 0.141)", WickedWaterway)}
                {getSVGLocationGroup("supplyStore", 960, 536, "translate(524 178) scale(0.139 0.14)", SupplyStore)}
                {getSVGLocationGroup("grazingLands", 789, 409, "translate(184 273) scale(0.139 0.142)", GrazingLands)}
                {getSVGLocationGroup("vegieZone", 1502, 731, "translate(2 253) scale(0.138 0.138)", VegieZone)}
                {getSVGLocationGroup("grainField", 1333, 597, "translate(465 282) scale(0.144 0.139)", GrainField)}
                {getSVGLocationGroup("bananaBunches", 675, 551, "translate(108 64) scale(0.138 0.136)", BananaBunches)}
                {getSVGLocationGroup("fruityOrchard", 1026, 743, "translate(131 120) scale(0.139 0.148)", FruityOrchard)}
                {getSVGLocationGroup("healthyTown", 880, 639, "translate(253 54) scale(0.144 0.139)", HealthyTown)}
                {getSVGLocationGroup("dairyPark", 1636, 1225, "translate(360 54) scale(0.139 0.141)", DairyPark)}
                {getSVGLocationGroup("cluckyCoop", 344, 358, "translate(498 141) scale(0.12)", CluckyCoop)}
                {getSVGLocationGroup("coolCloud", 2167, 611, "translate(476) scale(0.141 0.139)", CoolCloud)}
                {getSVGLocationGroup("yoghurtMountains", 1094, 635, "translate(545 80) scale(0.14 0.14)", YoghurtMountains)}
                {getSVGLocationGroup("aquaOcean", 1737, 664, "translate(259 397) scale(0.139 0.141)", AquaOcean)}
            </svg>
        </div>
    );

}