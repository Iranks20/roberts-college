/*
  Photos used on the website. All are openly licensed on Wikimedia Commons; licences that need
  credit are listed on the Photo credits page (/credits). Swap these for the school's own photos
  when they are available: keep the same keys and the whole site updates.
*/
import heroLearners from '../assets/photos/hero-learners-laptop.jpg'
import computerLab from '../assets/photos/computer-lab-uganda.jpg'
import secondaryStudents from '../assets/photos/secondary-students-uganda.jpg'
import laptopIndoors from '../assets/photos/students-laptop-indoors.jpg'
import primaryLearners from '../assets/photos/primary-learners-laptop.jpg'
import readingLaptop from '../assets/photos/student-reading-laptop.jpg'
import graduation from '../assets/photos/graduation-makerere.jpg'
import kampala from '../assets/photos/kampala-skyline.jpg'
import crane from '../assets/photos/grey-crowned-crane.jpg'
import girlsComputer from '../assets/photos/girls-computer-uganda.jpg'
import watercolours from '../assets/photos/girls-watercolours.jpg'
import tutor from '../assets/photos/tutor-laptop.jpg'

export type PhotoKey = keyof typeof photos
type P = { src: string; alt: string; title: string; author: string; license: string; source: string }
const commons = (t: string) => `https://commons.wikimedia.org/wiki/File:${t.replace(/ /g, '_')}`

export const photos = {
  heroLearners: { src: heroLearners, alt: 'Students in school uniform gathered around a laptop outdoors', title: 'JHS students looking on a laptop.jpg', author: 'Bright Kwame Ayisi (Kwameghana)', license: 'CC0' },
  computerLab: { src: computerLab, alt: 'Secondary students working at computers in a school computer lab in Uganda', title: 'Nala Secondary Students.jpg', author: 'Husseyn Issa', license: 'CC0' },
  secondaryStudents: { src: secondaryStudents, alt: 'Ugandan secondary school students in uniform in class', title: 'Nala Secondary School Students at computer Lab.jpg', author: 'Husseyn Issa', license: 'CC0' },
  laptopIndoors: { src: laptopIndoors, alt: 'Students sharing a laptop at a classroom desk', title: 'Students using a computer laptop.jpg', author: 'Bright Kwame Ayisi (Kwameghana)', license: 'CC0' },
  primaryLearners: { src: primaryLearners, alt: 'Young learners looking at a laptop together outdoors', title: 'A group of female students looking on a laptop 01.jpg', author: 'Bright Kwame Ayisi (Kwameghana)', license: 'CC0' },
  readingLaptop: { src: readingLaptop, alt: 'A student reading from a laptop', title: 'A student reading from a laptop.jpg', author: 'Jaokov', license: 'CC BY-SA 4.0' },
  graduation: { src: graduation, alt: 'Graduates celebrating at a university graduation in Kampala', title: 'Makerere University Graduation 2024 22.jpg', author: 'Ssemmanda will', license: 'CC BY-SA 4.0' },
  kampala: { src: kampala, alt: 'The Kampala city skyline', title: 'Kampala skyline.jpg', author: 'Todd Huffman', license: 'CC BY 2.0' },
  crane: { src: crane, alt: 'A grey crowned crane, Uganda’s national bird', title: 'Austin Roberts Bird Sanctuary-010, Balearica regulorum (Grey crowned crane).jpg', author: 'Leo za1', license: 'CC BY-SA 3.0' },
  girlsComputer: { src: girlsComputer, alt: 'Schoolgirls in Bushenyi, Uganda, learning on a computer', title: 'CFSU Nov2010 KyeizoobaGirls Bushenyi (41) (5348561907).jpg', author: 'IICD', license: 'CC BY 2.0' },
  watercolours: { src: watercolours, alt: 'Young people learning to paint with watercolours together', title: 'Demonstrating the magic of watercolors.jpg', author: 'Monie photography', license: 'CC BY-SA 4.0' },
  tutor: { src: tutor, alt: 'A tutor working on a laptop', title: 'Tutorcbt 001.jpg', author: 'IBORO', license: 'CC BY-SA 4.0' },
} satisfies Record<string, Omit<P, 'source'>>

export const photoSource = (k: PhotoKey) => commons(photos[k].title)
