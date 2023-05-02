import widgetsManifest from '../widgets-manifest';
import { Link } from 'react-router-dom';

export default function List () {
  return (
    <div className="widget">
      <div className="min-h-screen bg-gray-200 ">
        <div className="container mx-auto py-4">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(widgetsManifest).map(([name]) => (
              <li className="border border-gray bg-white rounded text-gray-700 flex transition-shadow hover:shadow-xl flex-col gap-4" key={name}>
                <Link className="block py-4 w-full h-full text-center" to={'/browse/' + name}>{name}</Link>
                <img className="w-[400px] h-[209px]" alt="thumbnail" src={`/widgets/${name}/thumbnail.png`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
