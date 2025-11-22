export default function ErrorBox({ error }: { error: string }) {
  return (
    <div
      style={{
        color: "red",
        padding: "10px",
        backgroundColor: "#ffebee",
        borderRadius: "4px",
        marginBottom: "20px",
        marginTop: "20px",
      }}
    >
      Hata: {error}
    </div>
  );
}
