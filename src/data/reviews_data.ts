
interface DataType {
  id: number;
  img: string;
  name: string;
  title: string;
  date: string;
}

const reviews_data: DataType[] = [
  {
    id: 1,
    img: '/assets/img/bg-img/7.jpg',
    name: 'John Doe',
    title: 'Very good product. It is just amazing!',
    date: '12 Dec 2024',
  },
  {
    id: 2,
    img: '/assets/img/bg-img/8.jpg',
    name: 'Jane Smith',
    title: 'Very excellent product. Love it.',
    date: '8 Dec 2024',
  },
  {
    id: 3,
    img: '/assets/img/bg-img/9.jpg',
    name: 'Michael Brown',
    title: 'What a nice product it is. I am looking it is.',
    date: '28 Nov 2024',
  },
];

export default reviews_data;