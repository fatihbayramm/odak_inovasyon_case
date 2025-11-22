export default function SuccessBox({ success }: { success: string }) {
  return (
    <div
      style={{
        color: "green",
        padding: "10px",
        backgroundColor: "#e8f5e9",
        borderRadius: "4px",
        marginBottom: "20px",
        marginTop: "20px",
      }}
    >
      {success}
    </div>
  );
}
