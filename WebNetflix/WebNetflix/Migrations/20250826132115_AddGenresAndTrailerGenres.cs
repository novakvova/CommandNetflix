using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebNetflix.Migrations
{
    /// <inheritdoc />
    public partial class AddGenresAndTrailerGenres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Genre",
                schema: "neondb_owner",
                table: "Trailers");

            migrationBuilder.CreateTable(
                name: "Genres",
                schema: "neondb_owner",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrailerGenres",
                schema: "neondb_owner",
                columns: table => new
                {
                    TrailerId = table.Column<int>(type: "integer", nullable: false),
                    GenreId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrailerGenres", x => new { x.TrailerId, x.GenreId });
                    table.ForeignKey(
                        name: "FK_TrailerGenres_Genres_GenreId",
                        column: x => x.GenreId,
                        principalSchema: "neondb_owner",
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrailerGenres_Trailers_TrailerId",
                        column: x => x.TrailerId,
                        principalSchema: "neondb_owner",
                        principalTable: "Trailers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrailerGenres_GenreId",
                schema: "neondb_owner",
                table: "TrailerGenres",
                column: "GenreId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrailerGenres",
                schema: "neondb_owner");

            migrationBuilder.DropTable(
                name: "Genres",
                schema: "neondb_owner");

            migrationBuilder.AddColumn<string>(
                name: "Genre",
                schema: "neondb_owner",
                table: "Trailers",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
