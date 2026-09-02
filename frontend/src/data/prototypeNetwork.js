export const prototypeNetwork = {

    id : 'Jarakshak-demo-01',
    name : 'Jalrakshak Prototype Network ',

    nodes : [
        {
            id : 'W1',
            type : 'WATER_SOURCE',
            name : 'WATER TREATMENT PLANT',
            position : {x:100,y:100},
            status : 'NORMAL',
        },

        {
            id : 'SN1',
            type : 'SENSORS',
            name : 'SENSOR NODE 1',
            position : {x:600,y:100},
            status : 'ONLINE',
            device_id : 'ESP-32-001',
        },

        {
            id : 'W2',
            type : 'WATER_SOURCE',
            name : 'RESERVOIR',
            position : {x:1100,y:100},
            status : 'NORMAL',
        },
        
        {
            id : 'J1',
            type : 'JUNCTION',
            name : 'JUNCTION - 1',
            position : {x:480,y:100},
            status : 'NORMAL',
        },

        {
            id : 'Z-MINING',
            type : 'ZONE',
            name : 'MINING ZONE',
            zoneType : 'MINING',
            connectionPoint : {x:480,y:200},
            geometry : {
                type : 'POLYGON',
                coordinates : [
                    {x:300,y:200},
                    {x:300,y:400},
                    {x:900,y:400},
                    {x:900,y:200},
                ],

            },
            status : 'NORMAL',
        },

        {
            id : 'J2',
            type : 'JUNCTION',
            name : 'JUNCTION - 2',
            position : {x:1100,y:450},
            status : 'NORMAL',
        },

        {
            id : 'Z-URBAN',
            type : 'ZONE',
            name : 'URBAN ZONE',
            zoneType : 'URBAN',
            connectionPoint : {x:1100,y:600},
            geometry : {
                type : 'POLYGON',
                coordinates : [
                    {x:620,y:500},
                    {x:620,y:700},
                    {x:1200,y:700},
                    {x:1200,y:500},
                ],

            },
            status : 'NORMAL',
        },

        {
            id : 'SN2',
            type : 'SENSORS',
            name : 'SENSOR NODE 2',
            position : {x:600,y:450},
            status : 'ONLINE',
            device_id : 'ESP-32-001',
        },

        {
            id : 'Z-RURAL',
            type : 'ZONE',
            name : 'RURAL ZONE',
            zoneType : 'RURAL',
            connectionPoint : {x:100,y:600},
            geometry : {
                type : 'POLYGON',
                coordinates : [
                    {x:0,y:500},
                    {x:0,y:700},
                    {x:580,y:700},
                    {x:580,y:500},
                ],

            },
            
            status : 'NORMAL',   
        },

        {
            id : 'J3',
            type : 'JUNCTION',
            name : 'JUNCTION - 3',
            position : {x:100,y:450},
            status : 'NORMAL',
        },

    ],

    pipelines : [
        {
            id : 'P1',
            from : 'W1',
            to : 'J1',
            status : 'NORMAL',
        },

        {
            id : 'P2',
            from : 'J1',
            to : 'Z-MINING',
            status : 'CONTAMINATION',
        },

        {
            id : 'P3',
            from : 'J1',
            to : 'SN1',
            status : 'NORMAL',
        },

        {
            id : 'P4',
            from : 'SN1',
            to : 'W2',
            status : 'NORMAL',
        },

        {
            id : 'P5',
            from : 'W2',
            to : 'J2',
            status : 'NORMAL',
        },

        {
            id : 'P6',
            from : 'J2',
            to : 'Z-URBAN',
            status : 'WARNING',
        },

        {
            id : 'P7',
            from : 'J2',
            to : 'SN2',
            status : 'NORMAL',
        },

        {
            id : 'P8',
            from : 'SN2',
            to : 'J3',
            status : 'NORMAL',
        },

        {
            id : 'P9',
            from : 'J3',
            to : 'Z-RURAL',
            status : 'NORMAL',
        },
        
        {
            id : 'P10',
            from : 'J3',
            to : 'W1',
            status : 'NORMAL',
        },
    ],

};