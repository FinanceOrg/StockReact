import clsx from "clsx";

export default function AssetTransactions() {
    const header = [
        { name: 'ID', class: 'col-span-1'},
        { name: 'Name', class: 'col-span-2'},
        { name: 'Amount', class: 'col-span-2'},
        { name: 'Transaction date', class: 'col-span-2'},
        { name: 'Category', class: 'col-span-2'},
        { name: 'Type', class: 'col-span-2'},
    ]



    const data = [
        {id: 1, name: 'lorem', value: 40000, date: '2024.05.13 13:00', category: 'myCategory', type: 'Type'},
        {id: 1, name: 'lorem', value: 40000, date: '2024.05.13 13:00', category: 'myCategory', type: 'Type'},
        {id: 1, name: 'lorem', value: 40000, date: '2024.05.13 13:00', category: 'myCategory', type: 'Type'},
        {id: 1, name: 'lorem', value: 40000, date: '2024.05.13 13:00', category: 'myCategory', type: 'Type'},
    ]

    const dataKeys = Object.keys(data[0])
    // 'Category', 'Type'];
    return(
        <div>
            <div className="grid grid-cols-11 bg-white rounded-t-lg border-b border-gray-300">
                {
                    header.map((item, index) => (
                        <div key={index} className={clsx(
                            "m-auto py-2",
                            item.class
                        )}
                        >{ item.name }</div>
                    ))
                }
            </div>
            <div className="grid grid-cols-11 bg-white/90 rounded-b-lg">
                {
                    data.map((row) => (
                        dataKeys.map((key, index) => (
                            <div key={key} className={clsx(
                                'm-auto py-2',
                                index === 0 ? 'col-span-1' : 'col-span-2',
                            )}> { row[key] } </div>
                        ))
                    ))
                }
            </div>
        </div>
    )
}