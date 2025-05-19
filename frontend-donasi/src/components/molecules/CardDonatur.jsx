function CardDonatur({ donatur }) {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-bold">{donatur.nama}</h3>
      <p>{donatur.email}</p>
      <p>{donatur.no_hp}</p>
      <p>{donatur.alamat}</p>
    </div>
  );
}

export default CardDonatur;
