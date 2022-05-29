# Aplikacja restauracji API

API pozwala na zarządzanie personelem, magazynem produktów, stolikami, menu oraz zamówieniami i generowanie raportów. API umożliwia również rezerwację stolików.

Każdy endpoint prócz tworzenia rezerwacji wymaga autoryzacji, utworzona prośba o rezerwacje musi zostać jeszcze potwierdzona przez pracownika.
Autoryzacja kontrolowana jest przez token po zalogowaniu.

API skonfigurowana jest do obsługi bazy NoSQL MongoDB, po połączeniu z bazą uzupełniane są niezbędne rekordy w bazie do działania aplikacji.
Aby skonfigurować połączenie z bazą należy w katalogu utworzyć plik "conifg.json".

```json
{
	"secret": "#",
	"connectionString": "mongodb+srv://#:#@#.zbsku.mongodb.net/?retryWrites=true&w=majority"
}
```

---

## Modele danych

- Pracownik
  - Login
  - Hasło
  - Imię
  - Nazwisko
  - Stanowisko
- Dania
  - Nazwa
  - Cena
  - Kategoria
- Kategoria dania
  - Nazwa
- Zamówienia
  - Pracownik odpowiedzialny za zamówienie
  - Dania
  - Status zamówieani
  - Stolik
  - Cena
- Status zamówienia
  - Nazwa
- Stanowiska
  - Nazwa
  - Poziom dostępu
- Produkt
  - Nazwa
  - Cena
  - Ilość
  - Jednostka
- Zapotrzebowanie na produkty
  - Nazwa
  - Ilość
  - Jednostka
- Rezerwacja
  - Stolik
  - Imię i nazwisko klienta
  - Email klienta
  - Data rozpoczęcia
  - Data zakończenia
  - Czy potwierdzona
- Restauracja
  - Nazwa
  - Adres
  - Numer telefonu
  - NIP
  - Email
  - Strona WWW
- Stolik
  - Numer stoliku
  - Ilość miejsc
- Status Stoliku
  - Nazwa
- Jednostka produktu
  - Nazwa

# Endpointy

## Pracownicy

---

### **Login**

`GET` employee/login

```json
{
	"Login": "",
	"Password": ""
}
```

> Logowanie, zwraca token (Bearer Token)

### **Login**

`POST` employee/

```json
{
	"Login": "",
	"Password": "",
	"Name": "",
	"Surname": "",
	"Position": ""
}
```

> Resetruje w systmie nowego pracownika

### **Odczytanie pracownika**

`GET` employee/

> Odczytuje zalogowanego pracownika przez token.

### **Modyfikacja pracownika**

`PUT` employee/

```json
{
	"Login": "",
	"Password": "",
	"Password": "",
	"Name": "",
	"Surname": ""
}
```

> Modyfikuje zalogowanego pracownika przez token.

### **Usuwanie pracownika**

`DELETE` employee/

> Usuwa zalogowanego pracownika przez token.

---

### **Lista pracowników**

`GET` employee/list

> Zwraca liste wszystkich pracowników, wymaga odpowiednich uprawnień.

### **Odczytanie pracownika po ID**

`GET` employee/:id

> Odczytuje zalogowanego pracownika przez ID, wymaga odpowiednich uprawnień.

### **Modyfikacja pracownika po ID**

`PUT` employee/:id

```json
{
	"Login": "",
	"Password": "",
	"Password": "",
	"Name": "",
	"Surname": ""
}
```

> Modyfikuje zalogowanego pracownika przez ID, wymaga odpowiednich uprawnień.

### **Usuwanie pracownika po ID**

`DELETE` employee/:id

> Usuwa zalogowanego pracownika przez ID, wymaga odpowiednich uprawnień.

---

---

## Kategorie dań

---

### **Lista kategorii**

`GET` mealcategory/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Przykład: `mealcategory/list?sort=desc`

> Odczytuje liste kategorii dań.

### **Odczytanie kategorii**

`GET` mealcategory/:id

> Odczytuje kategorie.

### **Dodawanie kategorii**

`POST` mealcategory/

```json
{
	"Name": ""
}
```

> Dodaje kategorie.

### **Modyfikacja kategorii**

`PUT` mealcategory/:id

```json
{
	"Name": ""
}
```

> Modyfikuje kategorie.

### **Usuwanie kategorii**

`DELETE` mealcategory/:id

> Usuwa kategorie.

---

---

## Dania

---

### **Lista dań**

`GET` meal/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Parametry do sortowania:
> >
> > - Kategoria dania (mealcategory),
> > - Cena (price),
> > - Domyślnie: Nazwa (name)
> >
> > Kategoria dań:
> >
> > - ID kategorii dania
> >
> > Przykład: `meal/list?sort=desc&sortby=price&category=628e7156e8276180b1d04808`

> Odczytuje liste dań.

### **Odczytanie dania**

`GET` meal/:id

> Odczytuje danie.

### **Dodawanie dania**

`POST` meal/

```json
{
	"Name": "",
	"Price": "",
	"MealCategory": ""
}
```

> Dodaje danie.

### **Modyfikacja dania**

`PUT` meal/:id

```json
{
	"Name": "",
	"Price": "",
	"MealCategory": ""
}
```

> Modyfikuje danie.

### **Usuwanie dania**

`DELETE` meal/:id

> Usuwa danie.

---

---

## Zamówienia

---

### **Lista zamówień**

`GET` order/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Parametry do sortowania:
> >
> > - Nazwisko pracownika (employee),
> > - Numer stolika (table),
> > - Cena (price),
> > - Domyślnie: Status zamówienia (orderstate)
> >
> > Przykład: `order/list?sort=desc&sortby=price`

> Odczytuje liste zamówień. Wymagane odpowiednie uprawnienia.

### **Odczytanie zamówienia**

`GET` order/:id

> Odczytuje zamówienie. Wymagane odpowiednie uprawnienia.

### **Dodawanie zamówienia**

`POST` order/

```json
{
	"Employee": "",
	"Meal": "",
	"Table": "",
	"Price": ""
}
```

> Dodaje zamówienie. W przypadku nie podania ceny jest ona wyliczana automatycznie na podstawie podanych dań z menu. Wymagane odpowiednie uprawnienia.

### **Modyfikacja zamówienia**

`PUT` order/:id

```json
{
	"Employee": "",
	"Meal": "",
	"OrderState": "",
	"Table": "",
	"Price": ""
}
```

> Modyfikuje zamówienie. W przypadku nie podania ceny jest ona wyliczana automatycznie na podstawie podanych dań z menu. Wymagane odpowiednie uprawnienia.

### **Usuwanie zamówienia**

`DELETE` order/:id

> Usuwa zamówienie. Wymagane odpowiednie uprawnienia.

---

---

## Statusy zamówień

---

### **Lista statusów**

`GET` orderstate/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Przykład: `orderstate/list?sort=desc`

> Odczytuje liste dostępnych statusów zamówień. Opcjonalnie sortowane po nazwie.

### **Odczytanie statusu**

`GET` orderstate/:id

> Odczytuje status zamówienia.

### **Dodawanie statusu**

`POST` orderstate/

```json
{
	"Name": ""
}
```

> Dodaje status zamówienia. Wymagane odpowiednie uprawnienia.

### **Modyfikacja statusu**

`PUT` orderstate/:id

```json
{
	"Name": ""
}
```

> Modyfikuje status. Wymagane odpowiednie uprawnienia.

### **Usuwanie statusu**

`DELETE` orderstate/:id

> Usuwa status. Wymagane odpowiednie uprawnienia.

---

---

## Stanowiska pracownicze

---

### **Lista stanowisk**

`GET` position/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Przykład: `position/list?sort=desc`

> Odczytuje liste dostępnych stanowisk pracowników. Opcjonalnie sortowane po nazwie.

### **Odczytanie stanowiska**

`GET` position/:id

> Odczytuje stanowisko. Wymagane odpowiednie uprawnienia.

### **Odczytanie użytkowników po stanowisku**

`GET` position/employees/:id

> Odczytuje liste użytkowników przypisanych do tego stanowiska po ID stanowiska. Wymagane odpowiednie uprawnienia.

### **Dodawanie stanowiska**

`POST` position/

```json
{
	"Name": "",
	"AccessLevel": ""
}
```

> Dodaje stanowisko. Wymagane odpowiednie uprawnienia.

### **Modyfikacja stanowiska**

`PUT` position/:id

```json
{
	"Name": "",
	"AccessLevel": ""
}
```

> Modyfikuje stanowisko. Wymagane odpowiednie uprawnienia.

### **Usuwanie stanowiska**

`DELETE` position/:id

> Usuwa stanowisko. Wymagane odpowiednie uprawnienia.

---

---

## Produkty

---

### **Lista produktów**

`GET` product/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Parametry do sortowania:
> >
> > - Ilość (quantity),
> > - Cena (price),
> > - Domyślnie: Nazwa produktu (name)
> >
> > Paginacja:
> >
> > - Numer strony
> >
> > Przykład: `product/list?sort=desc&sortby=price&page=2`

> Odczytuje liste dostępnych produktów. W przypadku braku podania strony pokazuje pierwszą stronę. Pokazuje 5 produktów na stronę.

### **Odczytanie produktu**

`GET` product/:id

> Odczytuje produkty.

### **Dodawanie produktu**

`POST` product/

```json
{
	"Name": "",
	"Price": "",
	"Quantity": "",
	"Unit": ""
}
```

> Dodaje produkt. Wymagane odpowiednie uprawnienia.

### **Modyfikacja produktu**

`PUT` product/:id

```json
{
	"Name": "",
	"Price": "",
	"Quantity": "",
	"Unit": ""
}
```

> Modyfikuje produkt. Wymagane odpowiednie uprawnienia.

### **Usuwanie produktu**

`DELETE` product/:id

> Usuwa produkt. Wymagane odpowiednie uprawnienia.

---

---

## Zapotrzebowania na produkty

---

### **Lista zapotrzebowań**

`GET` productneed/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Parametry do sortowania:
> >
> > - Ilość (quantity),
> > - Domyślnie: Nazwa produktu (name)
> >
> > Paginacja:
> >
> > - Numer strony
> >
> > Przykład: `productneed/list?sort=desc&sortby=name&page=2`

> Odczytuje liste dostępnych produktów. Wyświetla 5 produktów na stronę. Wymagane odpowiednie uprawnienia.

### **Odczytanie zapotrzebowania**

`GET` productneed/:id

> Odczytuje zapotrzebowanie na produkty. Wymagane odpowiednie uprawnienia.

### **Dodawanie zapotrzebowania**

`POST` productneed/

```json
{
	"Name": "",
	"Quantity": "",
	"Unit": ""
}
```

> Dodaje zapotrzebowanie na produkty. Wymagane odpowiednie uprawnienia.

### **Modyfikacja zapotrzebowania**

`PUT` productneed/:id

```json
{
	"Name": "",
	"Quantity": "",
	"Unit": ""
}
```

> Modyfikuje zapotrzebowanie na produkty. Wymagane odpowiednie uprawnienia.

### **Usuwanie zapotrzebowania**

`DELETE` productneed/:id

> Usuwa zapotrzebowanie na produkty. Wymagane odpowiednie uprawnienia.

---

---

## Raporty

---

### **Raport obłożenia stolików**

`GET` raport/table/id=id

> Tworzy raport zamówień na stolik. Wymaga podanie jako parametr ID stolika lub jego numer. Wymagane odpowiednie uprawnienia.

### **Raport zamówień per kelner**

`GET` raport/employee?id=id

> Tworzy raport zamówień obsłużonych przez danego pracownika. wymaga podanie jako parametr ID pracownika. Wymagane odpowiednie uprawnienia.

### **Raport zamowień we wskazanym okresie czasu**

`GET` raport/date?startdate=date&enddate=date

> Tworzy raport złożonych zamówień w podanym okresiec czasu. Wymaga podanie daty rozpoczęcia oraz zakończenia raportu, obsługuje same daty jak i daty z czasem. Wymagane odpowiednie uprawnienia.

### **Raport przychodów we wskazanym okresie czasu**

`GET` raport/income?startdate=date&enddate=date

> Tworzy raport przychodów w podanym okresiec czasu. Wymaga podanie daty rozpoczęcia oraz zakończenia raportu, obsługuje same daty jak i daty z czasem. Wymagane odpowiednie uprawnienia.

---

---

## Rezerwacje

---

### **Lista rezerwacji**

`GET` reservation/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Parametry do sortowania:
> >
> > - Imię i nazwisko klienta (clientname),
> > - Domyślnie: Data rozpoczęcia (startdate)
> >
> > Data:
> >
> > - Teraz (now),
> > - Dzisiaj (today),
> > - Jutro (tomarrow),
> > - Dowolna data, z możliwą godziną
> >
> > Przykład: `reservation/list?sort=desc&sortby=clientname&date=June 1, 2022 08:00:00`

> Odczytuje liste rezerwacji.

### **Lista rezerwacji po statusie potwierdzenia**

`GET` reservation/confirmed

> Opcjonalne parametry:
>
> > Czy potwierdzona?:
> >
> > - Potwierdzona (true),
> > - Niepotwierdzona (false),
> >
> > Przykład: `reservation/confirmed?confirm=true`

> Odczytuje liste rezerwacji potwierdzonych lub nie. W przypadku innej wartości zwraca rezerwacje posortowane od potwierdzonych do niepotwierdzonych.

### **Odczytanie rezerwacji**

`GET` reservation/:id

> Odczytuje rezerwacje.

### **Dodawanie rezerwacji**

`POST` reservation/

```json
{
	"TableId": "",
	"ClientName": "",
	"ClientEmail": "",
	"StartDate": "",
	"EndDate": "",
	"IsConfirmed": "" //domyślnie false
}
```

> Dodaje rezerwacje.

### **Modyfikacja rezerwacji**

`PUT` reservation/:id

```json
{
	"TableId": "",
	"ClientName": "",
	"ClientEmail": "",
	"StartDate": "",
	"EndDate": "",
	"IsConfirmed": "" //domyślnie false
}
```

> Modyfikuje rezerwacje.

### **Usuwanie rezerwacji**

`DELETE` reservation/:id

> Usuwa rezerwacje.

---

---

## Restauracja

---

### **Lista Restauracji**

`GET` restaurant/list

> Odczytuje liste restauracji.

### **Odczytanie restauracji**

`GET` restaurant/
`GET` restaurant/:id
`GET` restaurant/info
`GET` restaurant/about

> Odczytuje restauracje główną lub po podanym ID.

### **Dodawanie restauracji**

`POST` restaurant/

```json
{
	"Name": "",
	"Address": "",
	"TelNumber": "",
	"NIP": "",
	"Email": "",
	"WWW": ""
}
```

> Dodaje restauracje. Wymaga odpowiednich uprawnień.

### **Modyfikacja restauracji**

`PUT` restaurant/:id

```json
{
	"Name": "",
	"Address": "",
	"TelNumber": "",
	"NIP": "",
	"Email": "",
	"WWW": ""
}
```

> Modyfikuje restauracje. Wymaga odpowiednich uprawnień.

### **Usuwanie restauracji**

`DELETE` restaurant/:id

> Usuwa restauracje. Wymaga odpowiednich uprawnień.

---

---

## Stoliki

---

### **Lista stolików**

`GET` table/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Parametry do sortowania:
> >
> > - Ilość miejsc (seats),
> > - Domyślnie: Numer stoliku (number)
> >
> > Przykład: `table/list?sort=desc&sortby=number`

> Odczytuje liste stolików.

### **Lista stolików z obecnymi statusami**

`GET` table/list/status

> Odczytuje liste stolików z obecnymi statusami.

### **Lista stolików dostępnych stolików**

`GET` table/list/available

> Opcjonalne parametry:
>
> > Data:
> >
> > - Pełna data z czasem,
> > - Na podany dzień
> >
> > Przykład: `table/available?date=May 26, 2022 10:24:00`

> Odczytuje liste dostępnych stolików.

### **Lista stolików zajętych stolików**

`GET` table/list/busy

> Opcjonalne parametry:
>
> > Data:
> >
> > - Pełna data z czasem,
> > - Na podany dzień
> >
> > Przykład: `table/busy?date=May 26, 2022 10:24:00`

> Odczytuje liste zajętych stolików.

### **Odczytanie stolika**

`GET` table/:id

> Odczytuje stolik.

### **Dodawanie stolika**

`POST` table/

```json
{
	"TableNumber": "",
	"SeatsNumber": ""
}
```

> Dodaje stolik.

### **Modyfikacja stolika**

`PUT` table/:id

```json
{
	"TableNumber": "",
	"SeatsNumber": ""
}
```

> Modyfikuje stolik.

### **Usuwanie stolika**

`DELETE` table/:id

> Usuwa stolik.

---

---

## Statusy stolika

---

### **Lista statusów**

`GET` tablestate/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Przykład: `tablestate/list?sort=desc`

> Odczytuje liste dostępnych statusów zamówień. Opcjonalnie sortowane po nazwie.

### **Odczytanie statusu**

`GET` tablestate/:id

> Odczytuje status zamówienia.

### **Dodawanie statusu**

`POST` tablestate/

```json
{
	"Name": ""
}
```

> Dodaje status. Wymagane odpowiednie uprawnienia.

### **Modyfikacja statusu**

`PUT` tablestate/:id

```json
{
	"Name": ""
}
```

> Modyfikuje status. Wymagane odpowiednie uprawnienia.

### **Usuwanie statusu**

`DELETE` tablestate/:id

> Usuwa status. Wymagane odpowiednie uprawnienia.

---

---

## Jednostki

---

### **Lista jednostek**

`GET` unit/list

> Opcjonalne parametry:
>
> > Sortowanie:
> >
> > - Rosnące (asc),
> > - Malejące (desc)
> >
> > Przykład: `unit/list?sort=desc`

> Odczytuje liste dostępnych jednostek. Opcjonalnie sortowane po nazwie.

### **Odczytanie jednostki**

`GET` unit/:id

> Odczytuje jednostke.

### **Dodawanie jednostki**

`POST` unit/

```json
{
	"Name": ""
}
```

> Dodaje jednostke. Wymagane odpowiednie uprawnienia.

### **Modyfikacja jednostki**

`PUT` unit/:id

```json
{
	"Name": ""
}
```

> Modyfikuje jednostke. Wymagane odpowiednie uprawnienia.

### **Usuwanie jednostki**

`DELETE` unit/:id

> Usuwa jednostke. Wymagane odpowiednie uprawnienia.
