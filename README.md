## Features

- **Seat Selection**: Enable users to choose and reserve specific airplane seats with ease. The first 10 seats are initially occupied and cannot be selected.
- **Passenger Information Form**: Seamlessly collect comprehensive passenger details with form validation to ensure all input fields are filled.
- **Inactivity Timer**: Automatically clear seat selections after 30 seconds of inactivity. If the user remains inactive, prompt them with a warning to continue the reservation process; otherwise, reset the selections.
- **Toast Notifications**: Deliver real-time feedback through intuitive notifications.
  - **Reservation Success Toast**: Display a success message upon successful reservation completion.
  - **Seat Occupied Warning**: Notify users when attempting to select an already occupied seat.
  - **Inactivity Warning**: Alert users when the remaining time is low or if they become inactive.
- **Seat Tooltips**: Show the occupant's name and surname fetched from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users) when hovering over occupied seats.
- **Dynamic Pricing**: Calculate and display the total cost in real-time as users select their seats (each seat costs 1,000 TL).
- **Seat Selection Limit**: Restrict seat selection to a maximum of 3 passengers.
- **Selection Persistence**: Maintain seat selections even after the page is refreshed.
- **Responsive Design**: Ensure optimal user experience across a variety of devices and screen sizes.
- **Real-time Updates**: Instantly reflect changes in seat availability and user interactions.

## Tech Stack

- **Next.js**: A robust React framework optimized for production environments.
- **React**: A powerful JavaScript library for building dynamic user interfaces.
- **TypeScript**: Enhances JavaScript with static typing for improved code reliability.
- **Tailwind CSS**: A utility-first CSS framework facilitating rapid and responsive UI development.
- **Zustand**: A lightweight and scalable state management solution for React applications.
- **Sonner**: An elegant library for managing toast notifications, enhancing user interaction.

## Used Packages

- **class-variance-authority**: Simplifies the management of conditional class names.
- **clsx**: Efficiently constructs `className` strings based on conditional logic.
- **lucide-react**: Provides a collection of beautifully designed, customizable icons.
- **zustand**: Offers simplistic and effective state management capabilities for React.
- **sonner**: Delivers stylish and customizable toast notifications for modern web applications.
- **tailwind-merge**: Merges Tailwind CSS classes seamlessly, preventing class conflicts.
- **tailwindcss-animate**: Adds animation utilities to Tailwind CSS, enabling dynamic UI effects.

## Özellikler

- **Koltuk Seçimi**: Kullanıcıların kolayca belirli uçak koltuklarını seçmesine ve ayırmasına olanak sağlar. İlk 10 koltuk başlangıçta dolu ve seçilemez.
- **Yolcu Bilgi Formu**: Tüm girdi alanlarının doldurulmasını sağlayarak form doğrulaması ile kapsamlı yolcu detaylarını sorunsuz bir şekilde toplayın.
- **Hareketsizlik Zamanlayıcısı**: Kullanıcı 30 saniye boyunca hareketsiz kalırsa koltuk seçimlerini otomatik olarak temizler. Kullanıcı hareketsiz kalırsa, rezervasyon işlemine devam etmesi için uyarılır; aksi takdirde seçimler sıfırlanır.
- **Toast Bildirimleri**: Sezgisel bildirimler aracılığıyla gerçek zamanlı geri bildirim sağlayın.
  - **Rezervasyon Başarı Toast'u**: Başarılı rezervasyon tamamlandığında bir başarı mesajı görüntüler.
  - **Koltuk Dolu Uyarısı**: Kullanıcılar zaten dolu olan bir koltuğu seçmeye çalıştığında bilgilendirir.
  - **Hareketsizlik Uyarısı**: Kalan süre azaldığında veya kullanıcı hareketsiz kaldığında uyarır.
- **Koltuk Tooltips'leri**: [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users)'den alınan dolu koltukların üzerine gelindiğinde koltuğun sahibinin adını ve soyadını gösterir.
- **Dinamik Fiyatlandırma**: Kullanıcılar koltuk seçtikçe toplam maliyeti gerçek zamanlı olarak hesaplar ve görüntüler (her koltuk 1.000 TL'dir).
- **Koltuk Seçim Sınırı**: Koltuk seçimini maksimum 3 yolcuyla sınırlandırır.
- **Seçim Kalıcılığı**: Sayfa yenilendiğinde bile koltuk seçimlerini korur.
- **Responsive Tasarım**: Çeşitli cihazlar ve ekran boyutları arasında optimal kullanıcı deneyimini garanti eder.
- **Gerçek Zamanlı Güncellemeler**: Koltuk kullanılabilirliği ve kullanıcı etkileşimlerindeki değişiklikleri anında yansıtır.

## Teknoloji Yığını

- **Next.js**: Üretim ortamları için optimize edilmiş güçlü bir React framework'ü.
- **React**: Dinamik kullanıcı arayüzleri oluşturmak için güçlü bir JavaScript kütüphanesi.
- **TypeScript**: Kod güvenilirliğini artırmak için JavaScript'e statik tipleme ekler.
- **Tailwind CSS**: Hızlı ve responsive UI geliştirmesini kolaylaştıran utility-first bir CSS framework'ü.
- **Zustand**: React uygulamaları için hafif ve ölçeklenebilir bir durum yönetim çözümü.
- **Sonner**: Kullanıcı etkileşimini geliştiren toast bildirimlerini yönetmek için zarif bir kütüphane.

## Kullanılan Paketler

- **class-variance-authority**: Koşullu sınıf adlarının yönetimini basitleştirir.
- **clsx**: Koşullu mantığa dayalı olarak className dizelerini verimli bir şekilde oluşturur.
- **lucide-react**: Güzel tasarlanmış, özelleştirilebilir ikonlar koleksiyonu sağlar.
- **zustand**: React için basit ve etkili durum yönetim yetenekleri sunar.
- **sonner**: Modern web uygulamaları için stilize edilmiş ve özelleştirilebilir toast bildirimleri sağlar.
- **tailwind-merge**: Tailwind CSS sınıflarını sorunsuz bir şekilde birleştirir, sınıf çakışmalarını önler.
- **tailwindcss-animate**: Tailwind CSS'e animasyon yardımcı programları ekler, dinamik UI efektleri sağlar.
