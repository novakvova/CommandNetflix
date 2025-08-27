using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebNetflix.Migrations
{
    /// <inheritdoc />
    public partial class AddUserFavoriteTrailers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserFavoriteTrailers",
                schema: "neondb_owner",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    TrailerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFavoriteTrailers", x => new { x.UserId, x.TrailerId });
                    table.ForeignKey(
                        name: "FK_UserFavoriteTrailers_Trailers_TrailerId",
                        column: x => x.TrailerId,
                        principalSchema: "neondb_owner",
                        principalTable: "Trailers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFavoriteTrailers_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "neondb_owner",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserFavoriteTrailers_TrailerId",
                schema: "neondb_owner",
                table: "UserFavoriteTrailers",
                column: "TrailerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserFavoriteTrailers",
                schema: "neondb_owner");
        }
    }
}
