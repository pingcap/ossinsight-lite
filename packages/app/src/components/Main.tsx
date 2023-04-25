import widgets from 'app:widgets-manifest';

export default function Main () {
  return (
    <div className="widget">
      <div className="min-h-screen bg-gray-200 ">
        <div className="container mx-auto py-4">
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {Object.entries(widgets).map(([name, widget]) => (
              <li className="border border-gray bg-white rounded text-gray-700 flex transition-shadow hover:shadow-xl">
                <a className='block py-4 w-full h-full text-center' href={name}>{name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}