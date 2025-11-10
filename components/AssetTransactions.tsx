import clsx from "clsx";

type AssetType = 'id' | 'name' | 'value' | 'date' | 'category' | 'type';

type AssetTransaction = {
    value: string;
    name: string;
    headerClass: string;
    dataClass: string;
    class: string;
    visibleInMobile: boolean;
}

type AssetTransactionData = {
    id: number;
    name: string;
    value: number;
    date: string;
    category: string;
    type: string;
}

export default function AssetTransactions() {
    const meta: AssetTransaction[] = [
        { value: 'id', name: 'ID', headerClass: '', dataClass: '' ,class: 'basis-1/11', visibleInMobile: false },
        { value: 'name', name: 'Name', headerClass: '', dataClass: 'basis-1/2 font-bold sm:font-normal' ,class: 'sm:basis-2/11', visibleInMobile: true  },
        { value: 'value', name: 'Amount', headerClass: '', dataClass: 'basis-1/2 text-right' ,class: 'sm:basis-2/11', visibleInMobile: true  },
        { value: 'date', name: 'Transaction date', headerClass: '', dataClass: 'basis-full' ,class: 'sm:basis-2/11', visibleInMobile: true  },
        { value: 'category', name: 'Category', headerClass: '', dataClass: '' ,class: 'basis-2/11', visibleInMobile: false  },
        { value: 'type', name: 'Type', headerClass: '', dataClass: '' ,class: 'basis-2/11', visibleInMobile: false  },
    ]

    const data: AssetTransactionData[] = [
        {id: 1, name: 'lorem', value: 4000000, date: '2024.05.13 13:00', category: 'myCategory', type: 'Type'},
        {id: 2, name: 'lorem', value: 970, date: '2024.03.24 12:59', category: 'myCategory', type: 'Type'},
        {id: 3, name: 'lorem', value: 235845, date: '2024.02.11 08:00', category: 'myCategory', type: 'Type'},
        {id: 4, name: 'lorem', value: 19563, date: '2024.02.11 07:59', category: 'myCategory', type: 'Type'},
    ]

    //const dataKeys = Object.keys(data[0]) as (keyof AssetTransactionData)[]
    return(
        <div className="mb-4">
            <div className="hidden sm:flex bg-white rounded-t-lg border-b border-gray-300 justify-center px-2">
                {
                    meta.map((item, index) => (
                        <div key={index} className={clsx(
                            "py-2 text-center",
                            item.class,
                            item.headerClass
                        )}
                        >{ item.name }</div>
                    ))
                }
            </div>
            {
                data.map((row, i) => (
                    <div key={row.id} className={clsx(
                        "flex flex-wrap sm:flex-nowrap py-2 justify-between px-4 sm:px-2 bg-white",
                        "sm:bg-white/90 hover:bg-white/70 transition duration-400",
                        i === data.length - 1 && "rounded-b-lg",
                        i === 0 && "rounded-t-lg sm:rounded-t-none"
                    )}>
                        {
                            meta.map((meta, index) => (
                                <div key={`${meta.value}-${row.id}`} className={clsx(
                                    'sm:text-center sm:justify-center',
                                    meta.class,
                                    meta.dataClass,
                                    meta.visibleInMobile ? '' : 'hidden sm:flex'
                                )}> { meta.value === 'value' ? `${row[meta.value]} Ft` : row[meta.value as AssetType] } </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}